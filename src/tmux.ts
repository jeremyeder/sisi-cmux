import { spawn } from 'child_process';
import chalk from 'chalk';
import { Project } from './types.js';
import { ValidationError } from './utils.js';

const SESSION_NAME = 'sisi-workspace';

function execTmux(args: string[], timeoutMs: number = 10000): Promise<string> {
  return new Promise((resolve, reject) => {
    const tmux = spawn('tmux', args, { stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    let finished = false;

    const timeout = setTimeout(() => {
      if (!finished) {
        finished = true;
        tmux.kill('SIGTERM');
        reject(new ValidationError(`tmux command timed out: tmux ${args.join(' ')}`, 'TMUX_TIMEOUT'));
      }
    }, timeoutMs);

    tmux.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    tmux.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    tmux.on('close', (code) => {
      clearTimeout(timeout);
      if (finished) {return;}
      finished = true;

      if (code === 0) {
        resolve(stdout.trim());
      } else {
        const errorMsg = stderr.trim() || `tmux command failed with code ${code}`;
        reject(new ValidationError(`tmux error: ${errorMsg}`, 'TMUX_ERROR'));
      }
    });

    tmux.on('error', (error) => {
      clearTimeout(timeout);
      if (finished) {return;}
      finished = true;
      reject(new ValidationError(`Failed to execute tmux: ${error.message}`, 'TMUX_EXEC_ERROR'));
    });
  });
}

export async function sessionExists(): Promise<boolean> {
  try {
    await execTmux(['has-session', '-t', SESSION_NAME]);
    return true;
  } catch {
    return false;
  }
}

export async function createSession(projects: Project[], configPath: string): Promise<void> {
  if (await sessionExists()) {
    throw new ValidationError('Workspace session already exists. Use "sisi stop" first.', 'SESSION_EXISTS');
  }

  if (projects.length === 0) {
    throw new ValidationError('No projects found to create workspace.', 'NO_PROJECTS');
  }

  const createdWindows: string[] = [];
  
  try {
    // Create session with custom config and first project
    const firstProject = projects[0];
    console.log(chalk.dim(`  Creating session with ${firstProject.name}...`));
    
    await execTmux([
      '-f', configPath,
      'new-session', '-d', '-s', SESSION_NAME, 
      '-n', `${firstProject.icon}${firstProject.name}`,
      '-c', firstProject.path
    ]);
    createdWindows.push(firstProject.name);

    // Add remaining projects as windows
    for (let i = 1; i < projects.length; i++) {
      const project = projects[i];
      console.log(chalk.dim(`  Adding window for ${project.name}...`));
      
      try {
        await execTmux([
          'new-window', '-t', SESSION_NAME,
          '-n', `${project.icon}${project.name}`,
          '-c', project.path
        ]);
        createdWindows.push(project.name);
      } catch (error) {
        console.log(chalk.yellow(`  ⚠️  Failed to create window for ${project.name}: ${(error as Error).message}`));
        // Continue with other projects
      }
    }

    if (createdWindows.length === 0) {
      throw new ValidationError('Failed to create any project windows', 'NO_WINDOWS_CREATED');
    }

    console.log(chalk.green(`  ✓ Created ${createdWindows.length} project windows`));

  } catch (error) {
    // Cleanup on failure
    console.log(chalk.yellow('  Cleaning up partially created session...'));
    try {
      if (await sessionExists()) {
        await execTmux(['kill-session', '-t', SESSION_NAME]);
      }
    } catch {
      // Ignore cleanup errors
    }
    throw error;
  }
}

export async function attachSession(): Promise<void> {
  if (!(await sessionExists())) {
    throw new ValidationError('No workspace session found. Use "sisi start <directory>" first.', 'NO_SESSION');
  }
  
  // Use stdio: 'inherit' to properly connect terminal
  const { spawn } = await import('child_process');
  const tmux = spawn('tmux', ['attach-session', '-t', SESSION_NAME], { 
    stdio: 'inherit',
    detached: false 
  });
  
  return new Promise((resolve, reject) => {
    tmux.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new ValidationError(`Failed to attach to session: exit code ${code}`, 'ATTACH_ERROR'));
      }
    });
    
    tmux.on('error', (error) => {
      reject(new ValidationError(`Failed to attach to session: ${error.message}`, 'ATTACH_ERROR'));
    });
  });
}

export async function killSession(): Promise<void> {
  if (await sessionExists()) {
    await execTmux(['kill-session', '-t', SESSION_NAME]);
  }
}

export async function selectWindow(windowName: string): Promise<void> {
  await execTmux(['select-window', '-t', `${SESSION_NAME}:${windowName}`]);
}

export async function listWindows(): Promise<Array<{ index: number; name: string; active: boolean }>> {
  try {
    const output = await execTmux([
      'list-windows', '-t', SESSION_NAME, 
      '-F', '#{window_index}:#{window_name}:#{window_active}'
    ]);
    
    return output.split('\n').map(line => {
      const [index, name, active] = line.split(':');
      return {
        index: parseInt(index),
        name,
        active: active === '1'
      };
    });
  } catch {
    return [];
  }
}