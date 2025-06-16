import { readdir, stat, access } from 'fs/promises';
import { join } from 'path';
import chalk from 'chalk';
import { Project, ProjectType } from './types.js';
import { ValidationError } from './utils.js';

const EXCLUDE_PATTERNS = [
  'node_modules', '.git', 'target', 'dist', 'build', 
  '.cache', '.tmp', '__pycache__', '.idea', 'vendor',
  '.vscode', '.vs', 'bin', 'obj', '.gradle', '.mvn'
];

const MAX_DIRECTORIES = 100; // Limit for safety
const SCAN_TIMEOUT = 30000; // 30 seconds timeout

const PROJECT_TYPES: Record<string, { type: ProjectType; icon: string }> = {
  'package.json': { type: 'node', icon: '📦' },
  'requirements.txt': { type: 'python', icon: '🐍' },
  'pyproject.toml': { type: 'python', icon: '🐍' },
  'Cargo.toml': { type: 'rust', icon: '⚙️' },
  'go.mod': { type: 'go', icon: '⚙️' },
  'index.html': { type: 'web', icon: '🌐' },
};

async function detectProjectType(projectPath: string): Promise<{ type: ProjectType; icon: string }> {
  const detectionPromises = Object.entries(PROJECT_TYPES).map(async ([file, config]) => {
    try {
      await access(join(projectPath, file));
      return config;
    } catch {
      return null;
    }
  });

  const results = await Promise.all(detectionPromises);
  const detected = results.find(result => result !== null);
  
  return detected || { type: 'unknown', icon: '📁' };
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
}

export async function discoverProjects(rootDir: string): Promise<Project[]> {
  try {
    const discoveryPromise = async (): Promise<Project[]> => {
      const entries = await readdir(rootDir);
      const projects: Project[] = [];
      let processedCount = 0;
      let skippedCount = 0;

      console.log(chalk.dim(`  Scanning ${entries.length} entries...`));

      for (const entry of entries) {
        if (processedCount >= MAX_DIRECTORIES) {
          console.log(chalk.yellow(`  ⚠️  Limited to ${MAX_DIRECTORIES} directories for performance`));
          break;
        }

        if (EXCLUDE_PATTERNS.includes(entry) || entry.startsWith('.')) {
          skippedCount++;
          continue;
        }

        const fullPath = join(rootDir, entry);
        
        try {
          const stats = await stat(fullPath);

          if (stats.isDirectory()) {
            // Check if directory is accessible and has files
            try {
              const dirEntries = await readdir(fullPath);
              if (dirEntries.length === 0) {
                skippedCount++;
                continue; // Skip empty directories
              }

              const { type, icon } = await detectProjectType(fullPath);
              
              // Only include if it's a recognized project type or has substantial content
              if (type !== 'unknown' || dirEntries.length > 3) {
                projects.push({
                  name: entry,
                  path: fullPath,
                  type,
                  icon
                });
              } else {
                skippedCount++;
              }
              
              processedCount++;
            } catch {
              // Directory not accessible, skip it
              console.log(chalk.dim(`  ⚠️  Skipping inaccessible directory: ${entry}`));
              skippedCount++;
            }
          }
        } catch {
          // Can't stat the path, skip it
          console.log(chalk.dim(`  ⚠️  Skipping invalid path: ${entry}`));
          skippedCount++;
        }
      }

      if (skippedCount > 0) {
        console.log(chalk.dim(`  (Skipped ${skippedCount} non-project directories)`));
      }

      return projects.sort((a, b) => a.name.localeCompare(b.name));
    };

    return await withTimeout(discoveryPromise(), SCAN_TIMEOUT);
  } catch (error) {
    if ((error as Error).message.includes('timed out')) {
      throw new ValidationError(
        `Directory scanning timed out after ${SCAN_TIMEOUT/1000}s. Directory may be too large or have permission issues.`,
        'SCAN_TIMEOUT'
      );
    }
    throw new ValidationError(
      `Failed to discover projects in ${rootDir}: ${(error as Error).message}`,
      'DISCOVERY_FAILED'
    );
  }
}