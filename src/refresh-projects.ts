#!/usr/bin/env node

import chalk from 'chalk';
import { sessionExists, updateProjectWindows } from './tmux.js';
import { discoverProjects } from './discovery.js';
import { ValidationError } from './utils.js';

async function refreshProjects(rootDir?: string): Promise<void> {
  try {
    // Check if session exists
    if (!(await sessionExists())) {
      console.log(chalk.red('No workspace session found. Use "sisi start <directory>" first.'));
      process.exit(1);
    }

    // If no root directory provided, try to get it from current tmux session
    let targetDir = rootDir;
    if (!targetDir) {
      // For now, require the directory parameter
      // In future versions, we could store the original root dir in session variables
      console.log(chalk.red('Please provide the workspace directory to refresh.'));
      console.log(chalk.dim('Usage: sisi refresh <directory>'));
      process.exit(1);
    }

    console.log(chalk.blue('🔄 Refreshing workspace projects...'));
    console.log(chalk.dim(`  Scanning ${targetDir}...`));

    // Discover current projects
    const newProjects = await discoverProjects(targetDir);
    
    if (newProjects.length === 0) {
      console.log(chalk.yellow('⚠️  No projects found in directory'));
      return;
    }

    console.log(chalk.dim(`  Found ${newProjects.length} projects`));

    // Update tmux windows
    await updateProjectWindows(newProjects, targetDir);

    console.log(chalk.green('✅ Workspace refresh complete!'));

  } catch (error) {
    if (error instanceof ValidationError) {
      console.error(chalk.red(`❌ ${error.message}`));
    } else {
      console.error(chalk.red(`❌ Failed to refresh projects: ${(error as Error).message}`));
    }
    process.exit(1);
  }
}

// Command line execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const rootDir = process.argv[2];
  refreshProjects(rootDir).catch((error) => {
    console.error(chalk.red('❌ Refresh failed:'), error.message);
    process.exit(1);
  });
}

export { refreshProjects };