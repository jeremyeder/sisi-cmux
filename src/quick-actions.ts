#!/usr/bin/env node

import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import { access, readFile } from 'fs/promises';
import { join } from 'path';
import chalk from 'chalk';

const execAsync = promisify(exec);

interface QuickAction {
  key: string;
  title: string;
  command: string;
  description: string;
  color?: string;
}

interface ProjectStatus {
  type: string;
  icon: string;
  gitStatus?: string;
  gitBranch?: string;
  runningProcesses?: string[];
  dependencies?: { total: number; outdated: number };
  lastModified?: string;
}

class QuickActionsPanel {
  private projectPath: string;
  public projectStatus: ProjectStatus | null = null;

  constructor(projectPath: string = process.cwd()) {
    this.projectPath = projectPath;
  }

  async detectProjectType(): Promise<{ type: string; icon: string }> {
    const detectionMap = [
      { file: 'package.json', type: 'node', icon: '📦' },
      { file: 'requirements.txt', type: 'python', icon: '🐍' },
      { file: 'pyproject.toml', type: 'python', icon: '🐍' },
      { file: 'Cargo.toml', type: 'rust', icon: '⚙️' },
      { file: 'go.mod', type: 'go', icon: '⚙️' },
      { file: 'index.html', type: 'web', icon: '🌐' },
    ];

    for (const { file, type, icon } of detectionMap) {
      try {
        await access(join(this.projectPath, file));
        return { type, icon };
      } catch {
        continue;
      }
    }

    return { type: 'unknown', icon: '📁' };
  }

  async getGitStatus(): Promise<{ status: string; branch: string } | null> {
    try {
      const { stdout: branchOut } = await execAsync('git branch --show-current', { cwd: this.projectPath });
      const { stdout: statusOut } = await execAsync('git status --porcelain', { cwd: this.projectPath });
      
      const branch = branchOut.trim();
      const hasChanges = statusOut.trim().length > 0;
      const status = hasChanges ? '⚠️ changes' : '✅ clean';
      
      return { status, branch };
    } catch {
      return null;
    }
  }

  async getRunningProcesses(): Promise<string[]> {
    try {
      const { stdout } = await execAsync(`ps aux | grep -E "(${this.projectPath}|npm|python|cargo|go)" | grep -v grep`);
      return stdout.trim().split('\n').filter(line => line.length > 0).slice(0, 3);
    } catch {
      return [];
    }
  }

  async getDependencyStatus(): Promise<{ total: number; outdated: number } | null> {
    try {
      const { type } = await this.detectProjectType();
      
      switch (type) {
        case 'node': {
          const packageJson = JSON.parse(await readFile(join(this.projectPath, 'package.json'), 'utf-8'));
          const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
          return { total: Object.keys(deps).length, outdated: 0 };
        }
        
        case 'python':
          try {
            const requirements = await readFile(join(this.projectPath, 'requirements.txt'), 'utf-8');
            const lines = requirements.split('\n').filter(line => line.trim() && !line.startsWith('#'));
            return { total: lines.length, outdated: 0 };
          } catch {
            return null;
          }
        
        default:
          return null;
      }
    } catch {
      return null;
    }
  }

  async gatherProjectStatus(): Promise<ProjectStatus> {
    const { type, icon } = await this.detectProjectType();
    const git = await this.getGitStatus();
    const processes = await this.getRunningProcesses();
    const dependencies = await this.getDependencyStatus();

    return {
      type,
      icon,
      gitStatus: git?.status,
      gitBranch: git?.branch,
      runningProcesses: processes,
      dependencies: dependencies || undefined,
      lastModified: new Date().toLocaleTimeString()
    };
  }

  getProjectActions(): QuickAction[] {
    if (!this.projectStatus) {
      return [];
    }

    const actions: QuickAction[] = [];

    // Universal actions
    actions.push(
      { key: 'e', title: 'Open in Editor', command: 'code .', description: 'Open project in VS Code', color: 'blue' },
      { key: 'f', title: 'File Explorer', command: 'open .', description: 'Open in Finder/Explorer', color: 'cyan' }
    );

    // Git actions
    if (this.projectStatus.gitBranch) {
      actions.push(
        { key: 'g', title: 'Git Status', command: 'git status', description: 'Show git status', color: 'green' },
        { key: 'l', title: 'Git Log', command: 'git log --oneline -10', description: 'Show recent commits', color: 'green' }
      );
    }

    // Project-specific actions
    switch (this.projectStatus.type) {
      case 'node':
        actions.push(
          { key: 'd', title: 'Dev Server', command: 'npm run dev', description: 'Start development server', color: 'yellow' },
          { key: 't', title: 'Run Tests', command: 'npm test', description: 'Run test suite', color: 'magenta' },
          { key: 'b', title: 'Build', command: 'npm run build', description: 'Build for production', color: 'red' },
          { key: 'i', title: 'Install Deps', command: 'npm install', description: 'Install dependencies', color: 'blue' }
        );
        break;

      case 'python':
        actions.push(
          { key: 'd', title: 'Run App', command: 'python main.py', description: 'Run Python application', color: 'yellow' },
          { key: 't', title: 'Run Tests', command: 'pytest', description: 'Run Python tests', color: 'magenta' },
          { key: 'i', title: 'Install Deps', command: 'pip install -r requirements.txt', description: 'Install dependencies', color: 'blue' }
        );
        break;

      case 'rust':
        actions.push(
          { key: 'd', title: 'Cargo Run', command: 'cargo run', description: 'Run Rust application', color: 'yellow' },
          { key: 't', title: 'Cargo Test', command: 'cargo test', description: 'Run Rust tests', color: 'magenta' },
          { key: 'b', title: 'Cargo Build', command: 'cargo build', description: 'Build Rust project', color: 'red' }
        );
        break;

      case 'go':
        actions.push(
          { key: 'd', title: 'Go Run', command: 'go run .', description: 'Run Go application', color: 'yellow' },
          { key: 't', title: 'Go Test', command: 'go test ./...', description: 'Run Go tests', color: 'magenta' },
          { key: 'b', title: 'Go Build', command: 'go build', description: 'Build Go binary', color: 'red' }
        );
        break;
    }

    return actions;
  }

  displayStatus(): void {
    if (!this.projectStatus) {
      return;
    }

    console.log(chalk.bold('\n🚀 Quick Actions Panel\n'));
    
    // Project info
    console.log(chalk.bold('📊 Project Status:'));
    console.log(`  ${this.projectStatus.icon} Type: ${chalk.cyan(this.projectStatus.type)}`);
    
    if (this.projectStatus.gitBranch) {
      console.log(`  🌿 Branch: ${chalk.green(this.projectStatus.gitBranch)} ${this.projectStatus.gitStatus}`);
    }
    
    if (this.projectStatus.dependencies) {
      console.log(`  📦 Dependencies: ${chalk.blue(this.projectStatus.dependencies.total)} total`);
    }
    
    if (this.projectStatus.runningProcesses && this.projectStatus.runningProcesses.length > 0) {
      console.log(`  🏃 Running: ${chalk.yellow(this.projectStatus.runningProcesses.length)} processes`);
    }
    
    console.log(`  ⏰ Updated: ${chalk.dim(this.projectStatus.lastModified)}`);
  }

  displayActions(): void {
    const actions = this.getProjectActions();
    
    console.log(chalk.bold('\n⚡ Available Actions:'));
    
    actions.forEach(action => {
      const colorName = action.color || 'white';
      const colorFn = typeof chalk[colorName as keyof typeof chalk] === 'function' 
        ? chalk[colorName as keyof typeof chalk] as Function
        : chalk.white;
      console.log(`  ${colorFn(action.key.toUpperCase())} - ${action.title}`);
      console.log(`      ${chalk.dim(action.description)}`);
    });
    
    console.log(chalk.dim('\n  ESC - Close panel'));
    console.log(chalk.dim('  Q   - Quit\n'));
  }

  async executeAction(key: string): Promise<void> {
    const actions = this.getProjectActions();
    const action = actions.find(a => a.key.toLowerCase() === key.toLowerCase());
    
    if (!action) {
      console.log(chalk.red(`❌ Unknown action: ${key}`));
      return;
    }

    console.log(chalk.blue(`🚀 Executing: ${action.title}`));
    console.log(chalk.dim(`   Command: ${action.command}\n`));

    const [cmd, ...args] = action.command.split(' ');
    const child = spawn(cmd, args, {
      stdio: 'inherit',
      cwd: this.projectPath,
      shell: true
    });

    child.on('error', (error) => {
      console.log(chalk.red(`❌ Command failed: ${error.message}`));
    });
  }

  async show(): Promise<void> {
    console.clear();
    console.log(chalk.hex('#FF8C42')('  ▶ sisi-cmux Quick Actions'));
    console.log(chalk.gray(`  ${this.projectPath}\n`));

    // Gather project status
    this.projectStatus = await this.gatherProjectStatus();
    
    this.displayStatus();
    this.displayActions();

    // Interactive input handling would go here
    // For now, we'll just show the panel
    console.log(chalk.yellow('Press any action key to execute, or Q to quit.'));
  }
}

// CLI interface
async function main(): Promise<void> {
  const panel = new QuickActionsPanel();
  
  if (process.argv[2] === '--execute' && process.argv[3]) {
    // Execute specific action
    panel.projectStatus = await panel.gatherProjectStatus();
    await panel.executeAction(process.argv[3]);
  } else {
    // Show interactive panel
    await panel.show();
  }
}

main().catch(error => {
  console.error(chalk.red('Error in quick actions:'), error.message);
  process.exit(1);
}); 