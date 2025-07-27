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

# Refresh projects in existing workspace
./dist/cli.js refresh ~/projects
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
# Run core tests (simple, basic, types, project-commands)
npm test

# Run tests in watch mode
npm run test:watch

# Run documentation tests specifically
npm run test:docs

# Run all tests (including documentation)
npm run test:all

# Run single test file
npx jest src/__tests__/simple.test.ts

# Type checking
npm run type-check

# Linting
npm run lint

# Fix linting issues
npm run lint:fix

# Run full quality checks (includes type-check, lint, test)
npm run quality

# Security audit
npm run security:audit
```

### Publishing and Distribution
```bash
# Global install for testing
npm install -g .

# Test global install
sisi ~/projects
```

### Dynamic Project Management
The workspace supports dynamic project updates without recreating the entire session:

```bash
# CLI command to refresh projects
sisi refresh <directory>

# tmux key binding (within session)
Ctrl+b U  # Prompts for directory to refresh
```

**Dynamic Features:**
- **Add new projects**: Automatically creates tmux windows for newly discovered projects
- **Remove deleted projects**: Cleans up windows for projects that no longer exist
- **Preserve existing projects**: Maintains current windows and their state
- **Update tab bar**: Refreshes status bar to show current project count
- **Real-time feedback**: Shows what projects were added/removed during refresh

**Use Cases:**
- Added a new project to your workspace directory
- Deleted or moved a project
- Want to update the workspace without losing current tmux session state
- Need to sync workspace with current directory contents

## Architecture

### Core Flow
1. **CLI Entry (`cli.ts`)**: Main command handler using Commander.js
2. **Project Discovery (`discovery.ts`)**: Scans directories for projects, detects types (Node.js, Python, Rust, Go, Web)
3. **tmux Integration (`tmux.ts`)**: Creates/manages tmux sessions with project windows
4. **Configuration (`tmux-config.ts`)**: tmux key bindings and layout
5. **Dynamic Features**: 
   - **Project Commands (`project-commands.ts`)**: Context-aware dev/test/build command execution
   - **Quick Actions (`quick-actions.ts`)**: Interactive panel with project status and actions
   - **Refresh Projects (`refresh-projects.ts`)**: Dynamic workspace updates without session recreation

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
- `Ctrl+b Q` → **Quick actions panel** - Show project-specific actions and status
- `Ctrl+b P` → Enhanced project selector with type indicators
- `Ctrl+b U` → Refresh workspace projects dynamically
- `Ctrl+b C` → Launch Claude in current project
- `Ctrl+b R` → Run claude-checkpoint-restore
- `Ctrl+b M` → Run claude-checkpoint-save (Memory save)
- `Ctrl+b S` → Stop workspace with proper cleanup
- `Ctrl+b D` → **Dev/Run** - Start development server (context-aware)
- `Ctrl+b T` → **Test** - Run project tests (context-aware)
- `Ctrl+b B` → **Build** - Build project (context-aware)
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
- **Code Quality**: ESLint (with TypeScript parser), TypeScript compiler for type checking

## File Structure

- `src/cli.ts` - Main CLI entry point with comprehensive error handling
- `src/discovery.ts` - Enhanced project auto-discovery with timeout protection
- `src/tmux.ts` - Robust tmux session management with cleanup
- `src/tmux-config.ts` - tmux configuration template
- `src/types.ts` - TypeScript interfaces and types
- `src/utils.ts` - Validation utilities and error handling
- `src/project-selector.ts` - Enhanced TypeScript project picker with type indicators
- `src/stop-workspace.ts` - TypeScript workspace cleanup utility
- `src/project-commands.ts` - Context-aware project command execution (dev/test/build)
- `src/quick-actions.ts` - Interactive quick actions panel with project status
- `src/refresh-projects.ts` - Dynamic project refresh functionality
- `src/__tests__/` - Test suite with comprehensive coverage
  - `simple.test.ts` - Core functionality tests (utils, discovery)
  - `basic.test.ts` - Basic integration tests
  - `types.test.ts` - TypeScript type validation tests
  - `documentation.test.ts` - Documentation and example tests
  - `project-commands.test.ts` - Project command execution tests
  - `refresh-projects.test.ts` - Dynamic refresh functionality tests
  - `tmux-dynamic.test.ts` - Dynamic tmux session management tests
  - `keybindings.test.ts` - tmux key binding tests
- `dist/` - Compiled JavaScript output
- `man/sisi.1` - Manual page for the CLI
- `demo/` - Demo scripts and configuration

## Quality Assurance

### Pre-commit Requirements
Before committing any changes, ensure all quality checks pass:
```bash
npm run quality  # Runs type-check, lint, and test
npm run security:audit  # Check for security vulnerabilities
```

### Development Workflow
1. Make changes to TypeScript files in `src/`
2. Run `npm run build` to compile
3. Test locally with `./dist/cli.js ~/test-projects`
4. Run full test suite with `npm test`
5. Ensure all quality checks pass before committing