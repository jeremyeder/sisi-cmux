#!/usr/bin/env node

import { access } from 'fs/promises';
import { join } from 'path';
import { spawn } from 'child_process';
import chalk from 'chalk';

interface ProjectCommand {
  name: string;
  command: string;
  description: string;
  condition?: (projectPath: string) => Promise<boolean>; // eslint-disable-line no-unused-vars
}

interface ProjectCommandSet {
  dev: ProjectCommand[];
  test: ProjectCommand[];
  build: ProjectCommand[];
}

const COMMAND_MAPPINGS: Record<string, ProjectCommandSet> = {
  node: {
    dev: [
      { name: 'npm dev', command: 'npm run dev', description: 'Start development server' },
      { name: 'npm start', command: 'npm start', description: 'Start application' },
      { name: 'yarn dev', command: 'yarn dev', description: 'Start development server' },
    ],
    test: [
      { name: 'npm test', command: 'npm test', description: 'Run tests' },
      { name: 'npm test:watch', command: 'npm run test:watch', description: 'Run tests in watch mode' },
      { name: 'yarn test', command: 'yarn test', description: 'Run tests' },
    ],
    build: [
      { name: 'npm build', command: 'npm run build', description: 'Build for production' },
      { name: 'yarn build', command: 'yarn build', description: 'Build for production' },
    ]
  },
  python: {
    dev: [
      { 
        name: 'Django dev', 
        command: 'python manage.py runserver', 
        description: 'Start Django development server',
        condition: async (path) => {
          try {
            await access(join(path, 'manage.py'));
            return true;
          } catch {
            return false;
          }
        }
      },
      { 
        name: 'Flask dev', 
        command: 'python app.py', 
        description: 'Start Flask application',
        condition: async (path) => {
          try {
            await access(join(path, 'app.py'));
            return true;
          } catch {
            return false;
          }
        }
      },
      { name: 'Python script', command: 'python main.py', description: 'Run main Python script' },
    ],
    test: [
      { name: 'pytest', command: 'pytest', description: 'Run Python tests' },
      { name: 'pytest verbose', command: 'pytest -v', description: 'Run tests with verbose output' },
      { name: 'unittest', command: 'python -m unittest', description: 'Run unittest tests' },
    ],
    build: [
      { name: 'pip install', command: 'pip install -r requirements.txt', description: 'Install dependencies' },
      { name: 'setup.py', command: 'python setup.py build', description: 'Build package' },
    ]
  },
  rust: {
    dev: [
      { name: 'cargo run', command: 'cargo run', description: 'Run Rust application' },
      { name: 'cargo watch', command: 'cargo watch -x run', description: 'Run with file watching' },
    ],
    test: [
      { name: 'cargo test', command: 'cargo test', description: 'Run Rust tests' },
      { name: 'cargo test verbose', command: 'cargo test -- --nocapture', description: 'Run tests with output' },
    ],
    build: [
      { name: 'cargo build', command: 'cargo build', description: 'Build debug version' },
      { name: 'cargo build release', command: 'cargo build --release', description: 'Build release version' },
    ]
  },
  go: {
    dev: [
      { name: 'go run', command: 'go run .', description: 'Run Go application' },
      { name: 'go run main', command: 'go run main.go', description: 'Run main.go' },
    ],
    test: [
      { name: 'go test', command: 'go test ./...', description: 'Run Go tests' },
      { name: 'go test verbose', command: 'go test -v ./...', description: 'Run tests with verbose output' },
    ],
    build: [
      { name: 'go build', command: 'go build', description: 'Build Go binary' },
      { name: 'go install', command: 'go install', description: 'Install Go binary' },
    ]
  },
  web: {
    dev: [
      { name: 'Live Server', command: 'python -m http.server 8000', description: 'Start HTTP server' },
      { name: 'Node Server', command: 'npx http-server', description: 'Start Node.js HTTP server' },
    ],
    test: [
      { name: 'HTML Validate', command: 'npx html-validate *.html', description: 'Validate HTML' },
    ],
    build: [
      { name: 'Minify', command: 'npx html-minifier --minify-css --minify-js', description: 'Minify HTML/CSS/JS' },
    ]
  }
};

async function detectProjectType(projectPath: string): Promise<string> {
  const detectionMap = [
    { file: 'package.json', type: 'node' },
    { file: 'requirements.txt', type: 'python' },
    { file: 'pyproject.toml', type: 'python' },
    { file: 'Cargo.toml', type: 'rust' },
    { file: 'go.mod', type: 'go' },
    { file: 'index.html', type: 'web' },
  ];

  for (const { file, type } of detectionMap) {
    try {
      await access(join(projectPath, file));
      return type;
    } catch {
      continue;
    }
  }

  return 'unknown';
}

async function findBestCommand(commands: ProjectCommand[], projectPath: string): Promise<ProjectCommand | null> {
  for (const command of commands) {
    if (command.condition) {
      if (await command.condition(projectPath)) {
        return command;
      }
    } else {
      return command;
    }
  }
  return commands[0] || null;
}

async function executeProjectCommand(action: 'dev' | 'test' | 'build'): Promise<void> {
  const currentPath = process.cwd();
  const projectType = await detectProjectType(currentPath);
  
  if (projectType === 'unknown') {
    console.log(chalk.yellow(`⚠️  Unknown project type in ${currentPath}`));
    console.log(chalk.dim('Supported: Node.js, Python, Rust, Go, Web'));
    return;
  }

  const commandSet = COMMAND_MAPPINGS[projectType];
  if (!commandSet || !commandSet[action]) {
    console.log(chalk.yellow(`⚠️  No ${action} commands defined for ${projectType} projects`));
    return;
  }

  const bestCommand = await findBestCommand(commandSet[action], currentPath);
  if (!bestCommand) {
    console.log(chalk.yellow(`⚠️  No suitable ${action} command found`));
    return;
  }

  console.log(chalk.blue(`🚀 Running: ${bestCommand.name}`));
  console.log(chalk.dim(`   Command: ${bestCommand.command}`));
  console.log(chalk.dim(`   Description: ${bestCommand.description}`));
  console.log();

  // Execute the command
  const [cmd, ...args] = bestCommand.command.split(' ');
  const child = spawn(cmd, args, {
    stdio: 'inherit',
    cwd: currentPath,
    shell: true
  });

  child.on('error', (error) => {
    console.log(chalk.red(`❌ Command failed: ${error.message}`));
  });
}

async function getProjectType(directory: string): Promise<string> {
  const projectType = await detectProjectType(directory);
  return projectType || 'unknown';
}

// CLI interface
async function main() {
  const action = process.argv[2] as 'dev' | 'test' | 'build';
  const isDryRun = process.argv.includes('--dry-run');

  if (!action || !['dev', 'test', 'build'].includes(action)) {
    console.log(chalk.red('Usage: project-commands <dev|test|build> [--dry-run]'));
    process.exit(1);
  }

  // For dry-run, just detect and print the project type
  if (isDryRun) {
    const projectType = await getProjectType(process.cwd());
    console.log(`${projectType} project detected`);
    process.exit(0);
  }

  await executeProjectCommand(action);
}

main().catch(error => {
  console.error(chalk.red('Error executing command:'), error.message);
  process.exit(1);
}); 