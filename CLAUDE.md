# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

sisi-cmux is a TypeScript-based multi-project workspace manager that integrates with tmux and Claude Code. It auto-discovers projects in a directory and creates a tmux session with one window per project, providing seamless navigation and Claude integration.

## Development Commands

### Build and Development
```bash
# Install dependencies
npm install

# Build TypeScript to JavaScript
npm run build

# Build and run (for testing changes)
npm run start

# Development mode with ts-node
npm run dev

# Test locally after build
./dist/cli.js ~/projects
```

### Error Handling and Validation
The project includes comprehensive error handling:
- **Dependency checks**: Validates tmux and Claude CLI on startup
- **Directory validation**: Checks path exists, is readable, and is a directory
- **Timeout protection**: 30-second limit on directory scanning
- **Graceful degradation**: Continues if some projects fail to load
- **Cleanup on failure**: Removes partial tmux sessions if creation fails

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run single test file (once tests exist)
npx jest path/to/test.test.ts
```

### Publishing and Distribution
```bash
# Global install for testing
npm install -g .

# Test global install
sisi ~/projects
```

## Architecture

### Core Flow
1. **CLI Entry (`cli.ts`)**: Main command handler using Commander.js
2. **Project Discovery (`discovery.ts`)**: Scans directories for projects, detects types (Node.js, Python, Rust, Go, Web)
3. **tmux Integration (`tmux.ts`)**: Creates/manages tmux sessions with project windows
4. **Configuration (`tmux-config.ts`)**: tmux key bindings and layout

### Session Management
- **Session Name**: `sisi-workspace` (hardcoded constant)
- **Config File**: `/tmp/sisi-tmux-config.conf` (dynamically generated with script paths)
- **Project Windows**: Each discovered project gets its own tmux window with emoji icons
- **Key Bindings**: Custom tmux bindings for project navigation and Claude integration

### Project Detection Logic
Projects are identified by specific files in directories:
- `package.json` → Node.js (📦)
- `requirements.txt`/`pyproject.toml` → Python (🐍) 
- `Cargo.toml` → Rust (⚙️)
- `go.mod` → Go (⚙️)
- `index.html` → Web (🌐)

**Enhanced Discovery Features:**
- **Smart filtering**: Skips empty directories and recognizes project types
- **Large directory handling**: 100 directory limit with 30s timeout
- **Progress feedback**: Shows scanning progress and skipped directories
- **Permission handling**: Gracefully handles inaccessible directories

Excludes common build/cache directories: `node_modules`, `.git`, `target`, `dist`, `build`, `.cache`, `.vscode`, `.vs`, `bin`, `obj`, `.gradle`, `.mvn`, etc.

### Key tmux Bindings
- `Ctrl+b P` → Enhanced project selector with type indicators
- `Ctrl+b C` → Launch Claude in current project
- `Ctrl+b S` → Stop workspace with proper cleanup
- `Ctrl+b 1-9` → Jump to project windows

## TypeScript Configuration

- **Target**: ES2020 with ESM modules
- **Output**: `./dist/` directory
- **Type Checking**: Strict mode enabled
- **Main Entry**: `dist/cli.js` (shebang executable)

## Dependencies

- **Runtime**: Commander.js (CLI), Inquirer (prompts), Chalk (colors)
- **Peer Dependency**: `@anthropic-ai/claude-code` (Claude CLI integration)
- **Build**: TypeScript, ts-node for development
- **Testing**: Jest with ts-jest for TypeScript support

## File Structure

- `src/cli.ts` - Main CLI entry point with comprehensive error handling
- `src/discovery.ts` - Enhanced project auto-discovery with timeout protection
- `src/tmux.ts` - Robust tmux session management with cleanup
- `src/tmux-config.ts` - tmux configuration template
- `src/types.ts` - TypeScript interfaces and types
- `src/utils.ts` - Validation utilities and error handling
- `src/project-selector.ts` - Enhanced TypeScript project picker with type indicators
- `src/stop-workspace.ts` - TypeScript workspace cleanup utility