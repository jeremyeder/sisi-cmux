---
sidebar_position: 7
---

# Troubleshooting

Common issues and solutions for sisi-cmux.

## Installation Issues

### "tmux: command not found"

**Problem**: tmux is not installed or not in PATH.

**Solution**: Install tmux using your system package manager:

```bash
# macOS
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

### "Permission denied" during npm install

**Problem**: Global npm installation requires elevated permissions.

**Solutions**:

1. **Use sudo** (quick fix):
   ```bash
   sudo npm install -g sisi-cmux
   ```

2. **Configure npm for global installs without sudo** (recommended):
   ```bash
   # Create global directory
   mkdir ~/.npm-global
   
   # Configure npm
   npm config set prefix '~/.npm-global'
   
   # Add to PATH in ~/.bashrc or ~/.zshrc
   echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
   source ~/.bashrc
   
   # Now install without sudo
   npm install -g sisi-cmux
   ```

### "Node.js version too old"

**Problem**: sisi requires Node.js 18+.

**Solution**: Update Node.js:

```bash
# Check current version
node --version

# Install latest LTS version
# Option 1: Use package manager
brew install node  # macOS
sudo apt install nodejs npm  # Ubuntu

# Option 2: Use nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts
```

## Runtime Issues

### "No projects found"

**Problem**: `No projects found in /path/to/directory`

**Diagnosis**:
```bash
# Check if directory exists and is readable
ls -la /path/to/directory

# Look for project files
find /path/to/directory -maxdepth 2 -name "package.json" -o -name "requirements.txt" -o -name "Cargo.toml" -o -name "go.mod" -o -name "index.html"
```

**Solutions**:

1. **Verify project structure**:
   ```bash
   # Ensure projects have marker files
   echo '{"name": "test"}' > ~/projects/test-app/package.json
   ```

2. **Check directory permissions**:
   ```bash
   # Fix permissions
   chmod -R 755 ~/projects
   ```

3. **Look in subdirectories**:
   ```bash
   # sisi scans recursively, but projects need marker files
   find ~/projects -type f -name "package.json" | head -5
   ```

### "Failed to create tmux session"

**Problem**: tmux session creation fails.

**Diagnosis**:
```bash
# Test tmux directly
tmux new-session -d -s "test-session"
tmux kill-session -t "test-session"

# Check for existing sessions
tmux list-sessions
```

**Solutions**:

1. **Kill existing sisi session**:
   ```bash
   tmux kill-session -t sisi-workspace
   # OR
   sisi stop
   ```

2. **Check tmux server status**:
   ```bash
   # Kill all tmux sessions
   tmux kill-server
   
   # Restart tmux
   tmux new-session -d -s "test"
   tmux kill-session -t "test"
   ```

3. **Verify tmux version**:
   ```bash
   tmux -V
   # Should be 2.0 or higher
   ```

### "Claude CLI not found" (Warning)

**Problem**: Claude integration not available.

**Note**: This is a warning, not an error. sisi works without Claude.

**To fix (optional)**:
1. Install Claude CLI from https://claude.ai/code
2. Authenticate: `claude auth`
3. Verify: `claude --version`

### "Scanning timeout" or "Too many directories"

**Problem**: Performance limits hit on large directories.

**Solutions**:

1. **Use more specific paths**:
   ```bash
   # Instead of scanning entire home directory
   sisi ~  # Slow, many directories
   
   # Use specific project directories
   sisi ~/work/active-projects  # Faster, focused
   ```

2. **Increase limits temporarily**:
   ```bash
   SISI_MAX_DIRS=200 SISI_TIMEOUT=60 sisi ~/large-project
   ```

3. **Clean up unnecessary directories**:
   ```bash
   # Remove build artifacts
   find ~/projects -name "node_modules" -type d -exec rm -rf {} +
   find ~/projects -name "target" -type d -exec rm -rf {} +
   find ~/projects -name "__pycache__" -type d -exec rm -rf {} +
   ```

## Session Management Issues

### "Cannot attach to session"

**Problem**: Session exists but can't attach.

**Diagnosis**:
```bash
# Check session status
tmux list-sessions
tmux has-session -t sisi-workspace && echo "Session exists"
```

**Solutions**:

1. **Force kill and recreate**:
   ```bash
   tmux kill-session -t sisi-workspace
   sisi ~/projects
   ```

2. **Use tmux directly**:
   ```bash
   tmux attach-session -t sisi-workspace
   ```

3. **Check for tmux server issues**:
   ```bash
   # Nuclear option: restart tmux entirely
   tmux kill-server
   sisi ~/projects
   ```

### "Session already exists" 

**Problem**: Cannot create new session because one exists.

**Solution**: This is expected behavior. sisi reuses existing sessions:

```bash
# Stop current session first
sisi stop

# Then create new one
sisi ~/different-projects
```

### Key bindings not working

**Problem**: `Ctrl+b P`, `Ctrl+b C`, or `Ctrl+b S` don't work.

**Diagnosis**:
```bash
# Check if in sisi session
echo $TMUX
tmux display-message -p '#S'  # Should show "sisi-workspace"

# List current key bindings
tmux list-keys | grep -E "bind-key.*[PCS]"
```

**Solutions**:

1. **Verify you're in sisi session**:
   ```bash
   # Should be in sisi-workspace session
   tmux display-message -p '#S'
   ```

2. **Check tmux config**:
   ```bash
   # Look for config file
   ls -la /tmp/sisi-tmux-config.conf
   
   # Reload config if needed
   tmux source-file /tmp/sisi-tmux-config.conf
   ```

3. **Use standard tmux prefix**:
   ```bash
   # Make sure you're using Ctrl+b (not Ctrl+a)
   # Default tmux prefix is Ctrl+b
   ```

## Performance Issues

### Slow project discovery

**Problem**: Takes too long to scan directories.

**Solutions**:

1. **Use SSD storage** for projects (not network drives)

2. **Limit scan depth**:
   ```bash
   # Organize projects in shallow structure
   ~/projects/
   ├── app1/
   ├── app2/
   └── app3/
   # Instead of deep nesting
   ```

3. **Exclude large directories**:
   ```bash
   # Move or remove large non-project directories
   mv ~/projects/node_modules ~/projects-backup/
   ```

4. **Use faster filesystem**:
   ```bash
   # Check filesystem type
   df -T ~/projects
   
   # ext4, APFS, NTFS are typically faster than NFS
   ```

### High memory usage

**Problem**: tmux or sisi consuming too much memory.

**Solutions**:

1. **Limit concurrent windows**:
   ```bash
   # Use smaller project sets
   sisi ~/projects/current-work  # 5-10 projects
   # Instead of
   sisi ~/all-projects  # 50+ projects
   ```

2. **Close unused panes**:
   ```bash
   # Inside tmux
   Ctrl+b x  # Kill current pane
   Ctrl+b &  # Kill current window
   ```

3. **Restart tmux server**:
   ```bash
   tmux kill-server
   sisi ~/projects
   ```

## Debug Information

### Enable Debug Mode

```bash
# Get detailed output
SISI_DEBUG=1 sisi ~/projects

# Shows:
# - Directory scanning progress
# - Project detection logic
# - tmux command execution
# - Error details
```

### System Information

```bash
# Collect system info for bug reports
echo "=== System Info ==="
uname -a
echo "=== Node.js ==="
node --version
npm --version
echo "=== tmux ==="
tmux -V
echo "=== sisi ==="
sisi --version
echo "=== PATH ==="
echo $PATH
echo "=== Disk Space ==="
df -h ~/projects 2>/dev/null || echo "Projects directory not found"
```

### Log Files

```bash
# Check for error logs
ls -la /tmp/sisi-*
cat /tmp/sisi-tmux-config.conf

# tmux server log (if available)
cat ~/.tmux.log 2>/dev/null || echo "No tmux log found"
```

## Getting Help

### Before Reporting Issues

1. **Update to latest version**:
   ```bash
   npm update -g sisi-cmux
   sisi --version
   ```

2. **Test with minimal setup**:
   ```bash
   # Create simple test case
   mkdir -p ~/test-sisi/project1
   echo '{"name": "test"}' > ~/test-sisi/project1/package.json
   sisi ~/test-sisi
   ```

3. **Collect debug information** (see above)

### Common Solutions Summary

| Problem | Quick Fix |
|---------|-----------|
| tmux not found | `brew install tmux` (macOS) or `sudo apt install tmux` (Linux) |
| Permission denied | `sudo npm install -g sisi-cmux` |
| No projects found | Check for `package.json`, `requirements.txt`, etc. |
| Session won't start | `tmux kill-session -t sisi-workspace; sisi ~/projects` |
| Key bindings broken | Verify in sisi-workspace session: `tmux display-message -p '#S'` |
| Too slow | Use specific directories: `sisi ~/projects/active` |
| High memory | Limit projects, restart tmux: `tmux kill-server` |

### Still Need Help?

If you're still experiencing issues:

1. **Check documentation**: Review other sections of this guide
2. **Search issues**: Look for similar problems in the GitHub repository
3. **Create issue**: Report bugs with debug information and system details

## Next Steps

- **[Installation](/docs/installation)** - Reinstall if needed
- **[Usage](/docs/usage)** - Learn proper command patterns
- **[Configuration](/docs/configuration)** - Advanced customization options