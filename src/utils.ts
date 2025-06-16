import { spawn } from 'child_process';
import { access, stat } from 'fs/promises';
// Utility functions for validation and error handling
import chalk from 'chalk';

export class ValidationError extends Error {
  public readonly code: string;
  constructor(message: string, code: string) {
    super(message);
    this.name = 'ValidationError';
    this.code = code;
  }
}

export class DependencyError extends Error {
  public readonly dependency: string;
  constructor(message: string, dependency: string) {
    super(message);
    this.name = 'DependencyError';
    this.dependency = dependency;
  }
}

function execCommand(command: string, args: string[] = []): Promise<{ stdout: string; stderr: string; code: number }> {
  return new Promise((resolve) => {
    const child = spawn(command, args, { stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      resolve({ stdout: stdout.trim(), stderr: stderr.trim(), code: code || 0 });
    });

    child.on('error', (error) => {
      resolve({ stdout: '', stderr: error.message, code: 1 });
    });
  });
}

export async function checkDependencies(): Promise<void> {
  console.log(chalk.blue('🔍 Checking dependencies...'));

  // Check tmux
  const tmuxResult = await execCommand('tmux', ['-V']);
  if (tmuxResult.code !== 0) {
    throw new DependencyError(
      'tmux is required but not found. Please install tmux:\n' +
      '  macOS: brew install tmux\n' +
      '  Ubuntu: sudo apt-get install tmux\n' +
      '  CentOS: sudo yum install tmux',
      'tmux'
    );
  }

  // Extract tmux version
  const tmuxVersion = tmuxResult.stdout.match(/tmux (\d+\.\d+)/)?.[1];
  if (tmuxVersion) {
    const majorVersion = parseFloat(tmuxVersion);
    if (majorVersion < 2.0) {
      throw new DependencyError(
        `tmux version ${tmuxVersion} is too old. Version 2.0+ required.`,
        'tmux'
      );
    }
    console.log(chalk.green(`✓ tmux ${tmuxVersion}`));
  }

  // Check Claude CLI (try both common names)
  const claudeCommands = ['claude', 'claude-code'];
  let claudeFound = false;
  let claudeVersion = '';

  for (const cmd of claudeCommands) {
    const result = await execCommand(cmd, ['--version']);
    if (result.code === 0) {
      claudeFound = true;
      claudeVersion = result.stdout || cmd;
      console.log(chalk.green(`✓ ${cmd} (${claudeVersion})`));
      break;
    }
  }

  if (!claudeFound) {
    throw new DependencyError(
      'Claude CLI is required but not found. Please install from:\n' +
      '  https://claude.ai/code\n' +
      'Then authenticate with: claude auth',
      'claude'
    );
  }
}

export async function validateDirectory(dirPath: string): Promise<void> {
  if (!dirPath || typeof dirPath !== 'string') {
    throw new ValidationError('Directory path is required', 'INVALID_PATH');
  }

  // Check if path exists
  try {
    await access(dirPath);
  } catch {
    throw new ValidationError(`Directory does not exist: ${dirPath}`, 'NOT_FOUND');
  }

  // Check if it's actually a directory
  try {
    const stats = await stat(dirPath);
    if (!stats.isDirectory()) {
      throw new ValidationError(`Path is not a directory: ${dirPath}`, 'NOT_DIRECTORY');
    }
  } catch (error) {
    throw new ValidationError(`Cannot access directory: ${dirPath} (${(error as Error).message})`, 'ACCESS_ERROR');
  }

  // Check if directory is readable
  try {
    await access(dirPath, 4); // R_OK = 4
  } catch {
    throw new ValidationError(`Directory is not readable: ${dirPath}`, 'NOT_READABLE');
  }
}

export async function validatePath(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export function formatError(error: Error): string {
  if (error instanceof ValidationError || error instanceof DependencyError) {
    return chalk.red(`❌ ${error.message}`);
  }
  return chalk.red(`❌ Error: ${error.message}`);
}

export async function withErrorHandling<T>(
  operation: () => Promise<T>, 
  context: string
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof ValidationError || error instanceof DependencyError) {
      throw error;
    }
    throw new Error(`${context}: ${(error as Error).message}`);
  }
}