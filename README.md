<div align="center">
  <img src="logo.svg" alt="sisi-cmux logo" width="128" height="128">
  
  # sisi-cmux
  
  **Simple multi-project workspace manager with Claude Code integration**
</div>

Turn any directory into an organized tmux workspace. Auto-discovers your projects, creates windows for each one, and sets up Claude Code integration - all with one command.

## Installation

```bash
npm install -g sisi-cmux
```

**Requirements:**
- [tmux](https://tmux.github.io/) 2.0+
- [Claude CLI](https://claude.ai/code) (for AI integration)

## Quick Start

```bash
# Create workspace from your projects directory
sisi ~/projects

# Now you're in tmux with:
# - One window per project
# - Smart project type detection
# - Claude Code integration
# - Fast project switching
```

## Commands

| Command | Description |
|---------|-------------|
| `sisi [directory]` | Create/attach workspace from directory |
| `sisi refresh <directory>` | **Refresh projects** - Update workspace with current projects |
| `sisi stop` | Stop the workspace |
| `sisi --help` | Show help |
| `sisi --version` | Show version |

## Key Bindings (inside tmux)

### Main Commands
| Keys | Action |
|------|--------|
| `Ctrl+b Q` | **Quick actions panel** - Show project-specific actions and status |
| `Ctrl+b P` | **Project selector** - Fuzzy search all projects |
| `Ctrl+b U` | **Refresh projects** - Dynamically update workspace projects |
| `Ctrl+b C` | **Launch Claude** in current project |
| `Ctrl+b R` | **Restore checkpoint** - Resume last Claude conversation |
| `Ctrl+b M` | **Memory save** - Save Claude checkpoint |
| `Ctrl+b S` | **Stop workspace** |

### Project Commands
| Keys | Action |
|------|--------|
| `Ctrl+b D` | **Dev/Run** - Start development server (context-aware) |
| `Ctrl+b T` | **Test** - Run project tests (context-aware) |
| `Ctrl+b B` | **Build** - Build project (context-aware) |

### Navigation
| Keys | Action |
|------|--------|
| `Ctrl+b 1-9` | Jump to project windows by number |
| `Ctrl+b n` | Next project window |
| `Ctrl+b p` | Previous project window |

### Pane Management
| Keys | Action |
|------|--------|
| `Ctrl+b \|` | Split pane vertically |
| `Ctrl+b -` | Split pane horizontally |
| `Ctrl+b h/j/k/l` | Navigate between panes (vim-style) |

## Project Detection

Automatically detects project types:

| File | Type | Icon |
|------|------|------|
| `package.json` | Node.js | 📦 |
| `requirements.txt`, `pyproject.toml` | Python | 🐍 |
| `Cargo.toml` | Rust | ⚙️ |
| `go.mod` | Go | ⚙️ |
| `index.html` | Web | 🌐 |

## Features

- ✅ **Zero configuration** - Works out of the box
- ✅ **Smart project discovery** - Detects 5+ project types
- ✅ **Performance limits** - Handles large directories safely
- ✅ **Error recovery** - Graceful handling of missing dependencies
- ✅ **Claude integration** - One-key AI assistance
- ✅ **Checkpoint save/restore** - Save and resume Claude conversations
- ✅ **Session persistence** - Attach/detach like normal tmux
- 🆕 **Project-specific commands** - Context-aware dev/test/build commands
- 🆕 **Quick actions panel** - Interactive menu with project status and actions

## Claude Checkpoint Save/Restore

The checkpoint feature allows you to save your Claude conversation state and restore it later, making it easy to continue long-running tasks across sessions.

### How it works

1. **During a Claude conversation**: Press `Ctrl+b M` to save a checkpoint (runs `claude-checkpoint-save`)
2. **Later, in any project**: Press `Ctrl+b R` to restore and continue (runs `claude-checkpoint-restore`)

**Note**: These commands depend on your Claude CLI supporting checkpoint functionality. If not available, you can use Claude's built-in `--resume` and `--continue` flags.

### Example workflow

```bash
# Start working on a feature
$ sisi ~/projects
# Navigate to your project window
# Press Ctrl+b C to start Claude

# After some work with Claude...
# Press Ctrl+b M to save checkpoint
# (You'll see: "✓ Checkpoint saved")

# ... time passes, maybe you close terminal ...

# Resume later
$ sisi ~/projects  
# Press Ctrl+b R to restore
# (Claude continues where you left off)
```

### What it looks like on GitHub

When using checkpoint save/restore in a project tracked by git, your workflow might look like:

```
┌─────────────────────────────────────────────────────┐
│ tmux: project-name                                  │
├─────────────────────────────────────────────────────┤
│ $ claude                                            │
│ Claude> Let me help you implement that feature...   │
│ [working on authentication.js]                      │
│                                                     │
│ User: Can we add OAuth support?                    │
│ Claude> Sure! Let me update the auth module...     │
│                                                     │
│ [Ctrl+b M pressed]                                  │
│ ✓ Checkpoint saved                                  │
│                                                     │
│ $ git add -A && git commit -m "WIP: OAuth setup"   │
│ $ exit                                              │
└─────────────────────────────────────────────────────┘

# Next day...

┌─────────────────────────────────────────────────────┐
│ tmux: project-name                                  │
├─────────────────────────────────────────────────────┤
│ [Ctrl+b R pressed]                                  │
│ ✓ Checkpoint restored                               │
│                                                     │
│ Claude> Continuing from where we left off with      │
│ OAuth implementation...                             │
│ [resumes exactly where you stopped]                 │
└─────────────────────────────────────────────────────┘
```

## Project-Specific Commands

The new context-aware command system automatically detects your project type and executes the most appropriate commands:

### How it works

- **`Ctrl+b D`** - **Dev/Run**: Starts development server or runs your application
- **`Ctrl+b T`** - **Test**: Runs the project's test suite
- **`Ctrl+b B`** - **Build**: Builds the project for production/distribution

### Project-specific behavior

| Project Type | Dev Command | Test Command | Build Command |
|--------------|-------------|--------------|---------------|
| **Node.js** | `npm run dev` → `npm start` | `npm test` | `npm run build` |
| **Python** | `python manage.py runserver` (Django) <br> `python app.py` (Flask) | `pytest` → `unittest` | `pip install -r requirements.txt` |
| **Rust** | `cargo run` | `cargo test` | `cargo build --release` |
| **Go** | `go run .` | `go test ./...` | `go build` |

### Smart detection

- **Django projects**: Automatically detects `manage.py` and uses Django commands
- **Flask projects**: Detects `app.py` and runs Flask applications
- **Monorepos**: Works in subdirectories with their own project files
- **Yarn vs npm**: Auto-detects and uses the appropriate package manager

## Quick Actions Panel

Press **`Ctrl+b Q`** to open an interactive panel showing:

### Project Status
```
🚀 Quick Actions Panel

📊 Project Status:
  📦 Type: node
  🌿 Branch: feature/new-ui ✅ clean
  📦 Dependencies: 47 total
  🏃 Running: 2 processes
  ⏰ Updated: 15:32
```

### Available Actions
```
⚡ Available Actions:

  E - Open in Editor
      Open project in VS Code
  
  D - Dev Server  
      Start development server
  
  T - Run Tests
      Run test suite
  
  G - Git Status
      Show git status
  
  ESC - Close panel
  Q   - Quit
```

### Interactive usage
- **Type any letter** to execute that action immediately
- **ESC** to close the panel and return to tmux
- **Q** to quit the panel

## Examples

```bash
# Web development projects
sisi ~/dev/websites
# Creates: 📦 next-app, 🌐 portfolio, 📦 blog

# Mixed language projects  
sisi ~/dev/experiments
# Creates: 🐍 ml-model, ⚙️ cli-tool, 📦 frontend

# Large monorepo (auto-limited for performance)
sisi ~/dev/big-company-repo
# ⚠️ Limited to 100 directories for performance
```

## Troubleshooting

**"tmux is required but not found"**
```bash
# macOS
brew install tmux

# Ubuntu/Debian
sudo apt install tmux

# CentOS/RHEL
sudo yum install tmux
```

**"Claude CLI is required but not found"**
- Install from https://claude.ai/code
- Run `claude auth` to authenticate

**"No projects found"**
- Make sure directories contain project files (package.json, etc.)
- Check directory permissions
- Use `ls -la` to verify project structure

## Development

```bash
git clone https://github.com/username/sisi-cmux
cd sisi-cmux
npm install
npm run build

# Test locally
./dist/cli.js ~/projects

# Run tests
npm test
```

## License

MIT