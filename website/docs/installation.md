---
sidebar_position: 2
---

# Installation

Learn how to install and set up sisi-cmux on your system.

## Prerequisites

Before installing sisi-cmux, make sure you have the required dependencies:

### Required Dependencies

#### tmux 2.0+
tmux is required for workspace management.

```bash
# macOS (with Homebrew)
brew install tmux

# Ubuntu/Debian
sudo apt update && sudo apt install tmux

# CentOS/RHEL/Fedora
sudo yum install tmux
# OR for newer versions:
sudo dnf install tmux

# Verify installation
tmux -V
```

#### Node.js 18+
Node.js is required to install and run sisi-cmux.

```bash
# Check if you have Node.js installed
node --version
npm --version

# If not installed, get it from:
# https://nodejs.org/
# Or use a version manager like nvm
```

### Optional Dependencies

#### Claude CLI (Recommended)
For AI integration features.

1. Visit [Claude Code](https://claude.ai/code)
2. Follow the installation instructions
3. Authenticate: `claude auth`

```bash
# Verify Claude CLI is available
claude --version
```

## Install sisi-cmux

### Global Installation (Recommended)

Install sisi-cmux globally to use it from anywhere:

```bash
npm install -g sisi-cmux
```

### Verify Installation

```bash
# Check version
sisi --version

# Show help
sisi --help

# Test with a directory
sisi ~/projects --dry-run
```

## Post-Installation Setup

### 1. Create Test Workspace

Try sisi-cmux with a sample directory:

```bash
# Create some test projects
mkdir -p ~/test-workspace/node-app ~/test-workspace/python-app
echo '{"name": "test-app"}' > ~/test-workspace/node-app/package.json
echo 'requests' > ~/test-workspace/python-app/requirements.txt

# Create workspace
sisi ~/test-workspace
```

### 2. Learn Key Bindings

Once in the tmux workspace, try these shortcuts:

- `Ctrl+b P` - Project selector (fuzzy search)
- `Ctrl+b C` - Launch Claude in current project
- `Ctrl+b S` - Stop workspace
- `Ctrl+b 1-9` - Jump to project windows

### 3. Exit and Cleanup

```bash
# Inside tmux, stop the workspace:
# Ctrl+b S
# Or exit tmux normally:
exit

# Clean up test files
rm -rf ~/test-workspace
```

## Alternative Installation Methods

### Development Installation

For contributing or local development:

```bash
# Clone repository
git clone https://github.com/jeremyeder/sisi-cmux.git
cd sisi-cmux

# Install dependencies
npm install

# Build project
npm run build

# Test locally
./dist/cli.js ~/projects

# Run tests
npm test
```

### NPX Usage

Use without installing globally:

```bash
npx sisi-cmux ~/projects
```

## Troubleshooting Installation

### Common Issues

**"tmux: command not found"**
- Install tmux using your system's package manager (see above)

**"Permission denied" errors**
- Try installing with sudo: `sudo npm install -g sisi-cmux`
- Or configure npm to install globally without sudo

**"Node.js version too old"**
- Update Node.js to version 18 or higher
- Use a version manager like [nvm](https://github.com/nvm-sh/nvm)

**"Claude CLI not found" (warning)**
- This is optional - sisi works without Claude
- Install Claude CLI for AI features: https://claude.ai/code

### Verification Commands

```bash
# System check
which tmux && echo "✅ tmux installed"
which node && echo "✅ Node.js installed"  
which claude && echo "✅ Claude CLI installed" || echo "⚠️  Claude CLI optional"
which sisi && echo "✅ sisi-cmux installed"

# Version check
echo "tmux: $(tmux -V)"
echo "node: $(node --version)"
echo "sisi: $(sisi --version)"
```

## Next Steps

Once installed, learn how to use sisi-cmux:

- **[Usage Guide](/docs/usage)** - Basic commands and workflows
- **[Key Bindings](/docs/key-bindings)** - Productivity shortcuts
- **[Project Detection](/docs/project-detection)** - How projects are discovered

Need help? Check the **[Troubleshooting](/docs/troubleshooting)** guide.