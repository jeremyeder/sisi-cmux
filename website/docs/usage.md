---
sidebar_position: 3
---

# Usage

Complete guide to using sisi-cmux commands and workflows.

## Basic Commands

### Start Workspace

Create or attach to a workspace from any directory:

```bash
sisi [directory]
```

**Examples:**
```bash
# Use current directory
sisi .

# Specify a directory
sisi ~/projects
sisi /path/to/my/projects

# Relative paths work too
sisi ../projects
```

### Stop Workspace

Stop the active workspace:

```bash
sisi stop
```

**Alternative:** Use `Ctrl+b S` inside tmux.

### Help and Version

```bash
# Show help
sisi --help
sisi -h

# Show version
sisi --version
sisi -v
```

### Dry Run

Preview what projects would be discovered without creating a workspace:

```bash
sisi ~/projects --dry-run
```

## Workflow Examples

### Web Development Setup

```bash
# Navigate to your web projects
sisi ~/dev/websites

# Result: tmux workspace with windows like:
# 1: 📦 next-portfolio
# 2: 🌐 static-site  
# 3: 📦 react-dashboard
# 4: 📦 node-api
```

### Multi-Language Projects

```bash
# Mixed technology stack
sisi ~/dev/experiments  

# Result: organized by project type:
# 1: 🐍 ml-experiments
# 2: ⚙️ rust-cli-tool
# 3: 📦 js-utilities
# 4: ⚙️ go-microservice
# 5: 🌐 portfolio-site
```

### Large Monorepo

```bash
# Performance-optimized for large directories
sisi ~/work/big-company-repo

# sisi automatically limits scanning to 100 directories
# with 30-second timeout for performance
```

## Inside the Workspace

Once your workspace is created, you'll be inside a tmux session with:

### Window Layout

- **Window per project** - Each discovered project gets its own window
- **Numbered windows** - Jump with `Ctrl+b 1-9`
- **Project icons** - Visual type indicators (📦 🐍 ⚙️ 🌐)
- **Clean names** - Directory names without clutter

### Default Behavior

When you enter a project window:
- **Current directory** set to project root
- **Ready to work** - no additional setup needed
- **Full tmux functionality** - all standard tmux features available

## Session Management

### Attach/Detach

sisi workspaces are standard tmux sessions:

```bash
# Detach (keep running in background)
Ctrl+b d

# Re-attach later
sisi ~/projects  # automatically attaches to existing session

# Or use tmux directly
tmux attach -t sisi-workspace
```

### Multiple Workspaces

Currently, sisi supports one workspace at a time:
- Starting a new workspace stops the current one
- Session name is always `sisi-workspace`
- Clean separation between different project directories

### Session Persistence

Your workspace persists until:
- You run `sisi stop`
- You press `Ctrl+b S` (stop workspace shortcut)
- tmux server is killed
- System reboot

## Advanced Usage

### Performance Considerations

For large directories, sisi includes safety limits:

```bash
# Large directory handling
sisi ~/huge-monorepo

# Automatic limits:
# - Maximum 100 directories scanned
# - 30-second timeout protection
# - Progress feedback during scanning
# - Graceful degradation if limits hit
```

### Project Discovery Control

Influence what gets discovered:

```bash
# Include hidden directories (contains project files)
sisi ~/projects  # .hidden-project/ with package.json will be found

# Exclude patterns (these are automatically skipped)
# - node_modules/
# - .git/
# - target/
# - dist/
# - build/
# - .cache/
# - .vscode/
# - bin/
# - obj/
```

### Error Handling

sisi gracefully handles common issues:

```bash
# Missing dependencies
sisi ~/projects
# ⚠️ tmux is required but not found
# ❌ Please install tmux first

# No projects found
sisi ~/empty-directory
# ⚠️ No projects found in /path/to/empty-directory
# 💡 Make sure directories contain project files

# Permission issues
sisi /protected/directory
# ⚠️ Permission denied reading some directories
# ✅ Continuing with accessible projects...
```

## Integration with Other Tools

### Claude Code Integration

If Claude CLI is installed:

```bash
# Inside any project window
Ctrl+b C  # Launches Claude in current project context
```

### Standard tmux Commands

All tmux functionality remains available:

```bash
# Window management
Ctrl+b c        # Create new window
Ctrl+b &        # Kill current window
Ctrl+b ,        # Rename window

# Pane management  
Ctrl+b %        # Split horizontally
Ctrl+b "        # Split vertically
Ctrl+b arrow    # Navigate panes

# Session management
Ctrl+b s        # Session selector
Ctrl+b d        # Detach session
```

### Shell Integration

sisi works with any shell:

```bash
# bash
sisi ~/projects

# zsh  
sisi ~/projects

# fish
sisi ~/projects

# Works in any terminal emulator
```

## Tips and Best Practices

### Organizing Projects

```bash
# Recommended directory structure
~/projects/
├── web/          # 🌐 Static sites, SPAs
├── apps/         # 📦 Node.js applications  
├── services/     # 📦 APIs, microservices
├── scripts/      # 🐍 Python utilities
├── tools/        # ⚙️ CLI tools, system utilities
└── experiments/  # Mixed technologies
```

### Workflow Optimization

1. **Start with sisi** - Begin each coding session with `sisi ~/projects`
2. **Use project selector** - `Ctrl+b P` for quick project switching
3. **Leverage Claude** - `Ctrl+b C` for AI assistance in any project
4. **Clean exit** - `Ctrl+b S` when done working

### Performance Tips

- Keep project directories under 100 subdirectories for best performance
- Use specific paths rather than scanning entire home directory
- Clean up unused projects periodically

## Next Steps

- **[Key Bindings](/docs/key-bindings)** - Master the productivity shortcuts
- **[Project Detection](/docs/project-detection)** - Understand how projects are discovered
- **[Troubleshooting](/docs/troubleshooting)** - Solve common issues