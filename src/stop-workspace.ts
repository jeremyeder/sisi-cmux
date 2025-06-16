#!/usr/bin/env node

import { spawn } from 'child_process';
import chalk from 'chalk';

const SESSION_NAME = 'sisi-workspace';

function execTmux(args: string[]): Promise<{ code: number; stderr: string }> {
  return new Promise((resolve) => {
    const tmux = spawn('tmux', args, { stdio: ['pipe', 'pipe', 'pipe'] });
    let stderr = '';

    tmux.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    tmux.on('close', (code) => {
      resolve({ code: code || 0, stderr: stderr.trim() });
    });

    tmux.on('error', (error) => {
      resolve({ code: 1, stderr: error.message });
    });
  });
}

async function stopWorkspace(): Promise<void> {
  try {
    // First check if session exists
    const checkResult = await execTmux(['has-session', '-t', SESSION_NAME]);
    
    if (checkResult.code !== 0) {
      console.log(chalk.yellow('No workspace session running'));
      return;
    }

    // Kill the session
    const killResult = await execTmux(['kill-session', '-t', SESSION_NAME]);
    
    if (killResult.code === 0) {
      console.log(chalk.green('✅ Workspace stopped successfully'));
    } else {
      console.log(chalk.yellow('Workspace may have already been stopped'));
    }
    
  } catch (error) {
    console.error(chalk.red('Error stopping workspace:'), (error as Error).message);
    process.exit(1);
  }
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  stopWorkspace().catch((error) => {
    console.error(chalk.red('Failed to stop workspace:'), error.message);
    process.exit(1);
  });
}