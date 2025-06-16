# sisi-cmux

**Simple multi-project workspace manager with Claude Code integration**

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
| `sisi stop` | Stop the workspace |
| `sisi --help` | Show help |
| `sisi --version` | Show version |

## Key Bindings (inside tmux)

| Keys | Action |
|------|--------|
| `Ctrl+b P` | **Project selector** - Fuzzy search all projects |
| `Ctrl+b C` | **Launch Claude** in current project |
| `Ctrl+b S` | **Stop workspace** |
| `Ctrl+b 1-9` | Jump to project windows |
| `Ctrl+b n/p` | Next/previous project |

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
- ✅ **Session persistence** - Attach/detach like normal tmux

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