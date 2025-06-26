#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { writeFileSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { discoverProjects } from './discovery.js';
import { createSession, attachSession, killSession, sessionExists } from './tmux.js';
import { TMUX_CONFIG } from './tmux-config.js';
import { refreshProjects } from './refresh-projects.js';
import { checkDependencies, validateDirectory, formatError, withErrorHandling } from './utils.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const program = new Command();

// Create tmux config file with correct script paths
function createTmuxConfig(): string {
  const configPath = '/tmp/sisi-tmux-config.conf';
  const scriptDir = __dirname;
  
  // Replace SCRIPT_DIR placeholder with actual path
  const config = TMUX_CONFIG.replace(/SCRIPT_DIR/g, scriptDir);
  writeFileSync(configPath, config);
  
  return configPath;
}

program
  .name('sisi')
  .description('Multi-project workspace manager with Claude code assistant integration')
  .version('1.0.0');

// Main command: sisi [directory] - create/attach workspace
program
  .argument('[directory]', 'Directory to scan for projects', process.cwd())
  .description('Create workspace from directory (or attach if exists)')
  .action(async (directory: string) => {
    try {
      // Display banner
      console.log(chalk.hex('#FF8C42')('\n  ███████ ██ ███████ ██'));
      console.log(chalk.hex('#FF8C42')('  ██      ██ ██      ██'));
      console.log(chalk.hex('#FF8C42')('  ███████ ██ ███████ ██'));
      console.log(chalk.hex('#FF8C42')('       ██ ██      ██ ██'));
      console.log(chalk.hex('#FF8C42')('  ███████ ██ ███████ ██'));
      console.log(chalk.hex('#E85A4F')(`\n  sisi-cmux v${program.version()}`));
      console.log(chalk.gray('  Multi-project workspace manager\n'));

      // Check dependencies first
      await withErrorHandling(() => checkDependencies(), 'Dependency check failed');

      // Validate directory
      await withErrorHandling(() => validateDirectory(directory), 'Directory validation failed');

      // If session exists, just attach
      if (await sessionExists()) {
        console.log(chalk.blue('📎 Attaching to existing workspace...'));
        await withErrorHandling(() => attachSession(), 'Failed to attach to session');
        return;
      }

      // Discover projects
      console.log(chalk.blue('🔍 Discovering projects...'));
      const projects = await withErrorHandling(
        () => discoverProjects(directory), 
        'Project discovery failed'
      );
      
      if (projects.length === 0) {
        console.log(chalk.yellow('❌ No projects found in'), directory);
        console.log(chalk.dim('A project should contain one of: package.json, requirements.txt, pyproject.toml, Cargo.toml, go.mod, index.html'));
        console.log(chalk.dim('Tip: Make sure subdirectories contain actual project files'));
        return;
      }

      // Show discovered projects with types
      console.log(chalk.green(`📦 Found ${projects.length} projects:`));
      const typeGroups = projects.reduce((groups, p) => {
        if (!groups[p.type]) {groups[p.type] = [];}
        groups[p.type].push(p);
        return groups;
      }, {} as Record<string, typeof projects>);

      Object.entries(typeGroups).forEach(([type, projectsOfType]) => {
        console.log(chalk.dim(`  ${type} (${projectsOfType.length}):`));
        projectsOfType.forEach(p => console.log(`    ${p.icon} ${p.name}`));
      });

      // Create tmux config and session
      const configPath = createTmuxConfig();
      await withErrorHandling(
        () => createSession(projects, configPath), 
        'Failed to create tmux session'
      );
      
      console.log(chalk.green('✅ Workspace created!'));
      console.log(chalk.dim('Key bindings:'));
      console.log(chalk.dim('  Ctrl+b Q  - Quick actions panel'));
      console.log(chalk.dim('  Ctrl+b P  - Project selector'));
      console.log(chalk.dim('  Ctrl+b U  - Refresh projects'));
      console.log(chalk.dim('  Ctrl+b C  - Launch Claude'));
      console.log(chalk.dim('  Ctrl+b D  - Dev/Run project'));
      console.log(chalk.dim('  Ctrl+b T  - Test project'));
      console.log(chalk.dim('  Ctrl+b B  - Build project'));
      console.log(chalk.dim('  Ctrl+b S  - Stop workspace'));
      console.log();
      
      // Attach to session
      await withErrorHandling(() => attachSession(), 'Failed to attach to session');
      
    } catch (error) {
      console.error(formatError(error as Error));
      process.exit(1);
    }
  });

// Stop command: sisi stop
program
  .command('stop')
  .description('Stop the workspace')
  .action(async () => {
    try {
      if (!(await sessionExists())) {
        console.log(chalk.yellow('No workspace running'));
        return;
      }
      
      await withErrorHandling(() => killSession(), 'Failed to stop workspace');
      console.log(chalk.green('✅ Workspace stopped'));
    } catch (error) {
      console.error(formatError(error as Error));
      process.exit(1);
    }
  });

// Refresh command: sisi refresh <directory>
program
  .command('refresh')
  .argument('<directory>', 'Directory to rescan for projects')
  .description('Refresh workspace projects dynamically')
  .action(async (directory: string) => {
    try {
      await withErrorHandling(() => validateDirectory(directory), 'Directory validation failed');
      await withErrorHandling(() => refreshProjects(directory), 'Failed to refresh projects');
    } catch (error) {
      console.error(formatError(error as Error));
      process.exit(1);
    }
  });

program.parse();