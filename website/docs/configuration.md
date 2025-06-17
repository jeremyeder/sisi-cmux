---
sidebar_position: 6
---

# Configuration

Advanced configuration options for customizing sisi-cmux behavior.

## Overview

sisi-cmux is designed to work out of the box with zero configuration. However, advanced users can customize behavior through:

- **Environment variables** - Runtime configuration
- **tmux configuration** - Custom key bindings
- **Project structure** - Organizing for optimal detection

## Environment Variables

### SISI_MAX_DIRS
Control the maximum number of directories to scan:

```bash
# Default: 100
export SISI_MAX_DIRS=150
sisi ~/large-projects
```

### SISI_TIMEOUT
Set the scanning timeout in seconds:

```bash
# Default: 30 seconds
export SISI_TIMEOUT=60
sisi ~/slow-filesystem
```

### SISI_DEBUG
Enable debug output:

```bash
# Enable detailed logging
export SISI_DEBUG=1
sisi ~/projects

# Shows:
# - Directory scanning progress
# - Project detection details
# - tmux command execution
```

## Custom Key Bindings

### Modifying sisi Shortcuts

sisi uses a temporary tmux config file. To customize:

1. **Find the config location**:
   ```bash
   # Config written to: /tmp/sisi-tmux-config.conf
   ```

2. **Override after workspace creation**:
   ```bash
   # Create workspace first
   sisi ~/projects
   
   # Then customize inside tmux
   tmux bind-key -n F1 run-shell 'sisi-project-selector'
   tmux bind-key M-c run-shell 'claude .'
   ```

### Persistent Custom Bindings

Add to your `~/.tmux.conf`:

```bash
# Custom sisi bindings (only active in sisi sessions)
if-shell '[ "$TMUX_SESSION" = "sisi-workspace" ]' {
  bind-key -n F1 run-shell 'sisi-project-selector'
  bind-key -n F2 run-shell 'claude .'
  bind-key -n F3 run-shell 'sisi stop'
}
```

## Project Organization

### Recommended Structure

Organize projects for optimal sisi experience:

```bash
~/projects/
├── active/           # Current work
│   ├── main-app/
│   └── client-site/
├── experiments/      # Prototypes
│   ├── ml-poc/
│   └── new-stack/
├── tools/           # Utilities
│   ├── deploy-scripts/
│   └── monitoring/
└── archived/        # Completed projects
    ├── old-app/
    └── legacy-site/
```

**Usage**:
```bash
# Work on active projects
sisi ~/projects/active

# Experiment with new ideas  
sisi ~/projects/experiments

# Maintain tools
sisi ~/projects/tools
```

### Multi-Context Workflows

Use different sisi workspaces for different contexts:

```bash
# Work projects
sisi ~/work/projects
# Session: sisi-workspace with work projects

# Stop and switch to personal
sisi stop
sisi ~/personal/projects  
# Session: sisi-workspace with personal projects
```

## Advanced tmux Integration

### Session Naming

Currently sisi uses a fixed session name (`sisi-workspace`). For multiple concurrent sessions, use tmux directly:

```bash
# Create additional sessions manually
tmux new-session -d -s "work-projects"
tmux new-session -d -s "personal-projects"

# Use sisi for primary workflow
sisi ~/main-projects  # Uses sisi-workspace session
```

### Window Naming

sisi automatically names windows after project directories. To customize:

```bash
# Inside tmux, rename windows
Ctrl+b ,  # Rename current window

# Or programmatically
tmux rename-window "Custom Name"
```

### Pane Layouts

Customize pane layouts for specific project types:

```bash
# In your ~/.tmux.conf
bind-key N if-shell 'test -f package.json' \
  'split-window -h; split-window -v; select-pane -t 0' \
  'display-message "Not a Node.js project"'
  
# Usage: Ctrl+b N in Node.js projects creates:
# ┌─────────┬─────────┐
# │ Editor  │ Server  │  
# │         ├─────────┤
# │         │ Tests   │
# └─────────┴─────────┘
```

## Performance Tuning

### Large Directory Optimization

For consistently large directories:

```bash
# Increase limits permanently
echo 'export SISI_MAX_DIRS=200' >> ~/.bashrc
echo 'export SISI_TIMEOUT=120' >> ~/.bashrc
source ~/.bashrc
```

### Filesystem-Specific Settings

```bash
# Network filesystems (slower)
export SISI_TIMEOUT=180
export SISI_MAX_DIRS=50

# Local SSD (faster)
export SISI_TIMEOUT=15  
export SISI_MAX_DIRS=300
```

### Exclude Patterns

Currently, exclusion patterns are built-in. For custom exclusions, pre-filter:

```bash
# Create symlink structure excluding unwanted dirs
mkdir ~/projects-filtered
find ~/projects -maxdepth 1 -type d \
  ! -name ".*" ! -name "node_modules" ! -name "target" \
  -exec ln -s {} ~/projects-filtered/ \;

sisi ~/projects-filtered
```

## Integration Customization

### Claude CLI Configuration

Customize Claude integration:

```bash
# Custom Claude args
export CLAUDE_ARGS="--model=claude-3-sonnet"

# Custom Claude commands in tmux config
bind-key C run-shell 'cd #{pane_current_path} && claude $CLAUDE_ARGS'
```

### Shell Integration

Add sisi helpers to your shell:

```bash
# In ~/.bashrc or ~/.zshrc

# Quick project workspace
alias wp='sisi ~/work/projects'
alias pp='sisi ~/personal/projects'

# Workspace with auto-attach
ws() {
  local dir=${1:-~/projects}
  sisi "$dir" || tmux attach -t sisi-workspace
}

# Stop workspace shortcut  
alias stop-ws='sisi stop'
```

## Troubleshooting Configuration

### Debug Configuration Issues

```bash
# Check environment
env | grep SISI_

# Test with debug output
SISI_DEBUG=1 sisi ~/projects

# Verify tmux config
tmux show-options -g | grep sisi
```

### Reset to Defaults

```bash
# Clear environment variables
unset SISI_MAX_DIRS SISI_TIMEOUT SISI_DEBUG

# Remove custom tmux config
tmux kill-server  # Clears all sessions and config
```

### Configuration Conflicts

If experiencing issues:

1. **Check tmux version**:
   ```bash
   tmux -V  # Requires 2.0+
   ```

2. **Test minimal setup**:
   ```bash
   # Create clean test environment
   env -i PATH="$PATH" sisi ~/test-projects
   ```

3. **Verify file permissions**:
   ```bash
   ls -la /tmp/sisi-tmux-config.conf
   ```

## Examples

### Development Team Setup

```bash
# Team lead configuration
export SISI_MAX_DIRS=200  # Larger codebases
export SISI_TIMEOUT=90    # Network drives

# Developer configuration  
alias start-work='sisi ~/workspace/current-sprint'
alias review-prs='sisi ~/workspace/review-branch'
```

### Multi-Language Developer

```bash
# Context-specific workspaces
alias js-work='sisi ~/dev/javascript'
alias py-work='sisi ~/dev/python'  
alias rs-work='sisi ~/dev/rust'

# Language-specific tmux configs
bind-key J if-shell 'test -f package.json' \
  'split-window -h "npm run dev"'
bind-key P if-shell 'test -f requirements.txt' \
  'split-window -h "python -m pytest --watch"'
```

## Next Steps

- **[Troubleshooting](/docs/troubleshooting)** - Solve common issues
- **[Usage](/docs/usage)** - Master the command workflows
- **[Key Bindings](/docs/key-bindings)** - Productivity shortcuts