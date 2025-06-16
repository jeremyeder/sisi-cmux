#!/usr/bin/env node

import { spawn } from 'child_process';
import chalk from 'chalk';

const SESSION_NAME = 'sisi-workspace';

interface TmuxWindow {
  index: number;
  name: string;
}

function execTmux(args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const tmux = spawn('tmux', args, { stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';

    tmux.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    tmux.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    tmux.on('close', (code) => {
      if (code === 0) {
        resolve(stdout.trim());
      } else {
        reject(new Error(`tmux error: ${stderr.trim()}`));
      }
    });

    tmux.on('error', (error) => {
      reject(error);
    });
  });
}

async function getWindows(): Promise<TmuxWindow[]> {
  try {
    const output = await execTmux([
      'list-windows', '-t', SESSION_NAME,
      '-F', '#{window_index}:#{window_name}'
    ]);
    
    return output.split('\n')
      .filter(line => line.trim())
      .map(line => {
        const [index, name] = line.split(':', 2);
        return { index: parseInt(index), name };
      })
      .sort((a, b) => a.index - b.index);
  } catch (error) {
    console.error(chalk.red('Failed to get window list:'), (error as Error).message);
    return [];
  }
}

async function showSelector(): Promise<void> {
  try {
    const windows = await getWindows();
    
    if (windows.length === 0) {
      console.log(chalk.yellow('No projects found in workspace'));
      return;
    }

    // Build tmux menu with enhanced display
    const menuArgs = [
      'display-menu', 
      '-T', 
      `Select Project (${windows.length} total) - ↑↓ + Enter, Esc to cancel`
    ];
    
    for (const window of windows) {
      // Extract project type for better display
      const projectType = getProjectTypeFromName(window.name);
      const displayText = `[${window.index}] ${window.name}${projectType ? ` (${projectType})` : ''}`;
      
      menuArgs.push(
        displayText,                                     // Display text with type
        '',                                              // Key binding (empty)
        `select-window -t ${SESSION_NAME}:${window.index}`  // Command
      );
    }
    
    // Execute menu
    const child = spawn('tmux', menuArgs, { stdio: 'inherit' });
    
    child.on('error', (error) => {
      console.error(chalk.red('Failed to show project selector:'), error.message);
    });
    
  } catch (error) {
    console.error(chalk.red('Error in project selector:'), (error as Error).message);
  }
}

function getProjectTypeFromName(windowName: string): string {
  // Extract project type from emoji/icon
  if (windowName.includes('📦')) {return 'Node.js';}
  if (windowName.includes('🐍')) {return 'Python';}
  if (windowName.includes('⚙️')) {return 'Rust/Go';}
  if (windowName.includes('🌐')) {return 'Web';}
  if (windowName.includes('📁')) {return 'Generic';}
  return '';
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  showSelector().catch((error) => {
    console.error(chalk.red('Project selector failed:'), error.message);
    process.exit(1);
  });
}