---
sidebar_position: 5
---

# Project Detection

Learn how sisi-cmux automatically discovers and categorizes your projects.

## Supported Project Types

sisi-cmux automatically detects projects based on specific files:

| Project Type | Detection File(s) | Icon | Description |
|--------------|------------------|------|-------------|
| **Node.js** | `package.json` | 📦 | JavaScript/TypeScript projects |
| **Python** | `requirements.txt`, `pyproject.toml` | 🐍 | Python applications |
| **Rust** | `Cargo.toml` | ⚙️ | Rust projects |
| **Go** | `go.mod` | ⚙️ | Go modules |
| **Web** | `index.html` | 🌐 | Static websites, SPAs |

## Detection Logic

### How It Works

1. **Directory Scan** - sisi scans the target directory recursively
2. **File Matching** - Looks for project marker files in each subdirectory
3. **Type Assignment** - Assigns project type based on first match
4. **Window Creation** - Creates tmux window with appropriate icon

### Priority Order

If multiple project files exist, sisi uses this priority:

1. **package.json** → Node.js (📦)
2. **Cargo.toml** → Rust (⚙️)
3. **go.mod** → Go (⚙️)
4. **pyproject.toml** → Python (🐍)
5. **requirements.txt** → Python (🐍)
6. **index.html** → Web (🌐)

### Example Structure

```
~/projects/
├── my-api/           # 📦 Node.js (has package.json)
│   ├── package.json
│   └── src/
├── ml-model/         # 🐍 Python (has requirements.txt)
│   ├── requirements.txt
│   └── train.py
├── cli-tool/         # ⚙️ Rust (has Cargo.toml)
│   ├── Cargo.toml
│   └── src/
├── web-service/      # ⚙️ Go (has go.mod)
│   ├── go.mod
│   └── main.go
└── portfolio/        # 🌐 Web (has index.html)
    ├── index.html
    └── assets/
```

## Exclusion Patterns

sisi automatically skips these directories:

### Build/Cache Directories
- `node_modules/`
- `target/` (Rust)
- `dist/`, `build/`
- `.cache/`, `.next/`
- `__pycache__/`, `.pytest_cache/`

### Version Control
- `.git/`
- `.svn/`
- `.hg/`

### IDE/Editor
- `.vscode/`, `.vs/`
- `.idea/`
- `*.egg-info/`

### System/Binary
- `bin/`, `obj/`
- `.gradle/`, `.mvn/`
- `venv/`, `.venv/`

## Performance Limits

For large directories, sisi includes safety measures:

### Automatic Limits
- **Max directories**: 100 subdirectories scanned
- **Timeout**: 30-second scanning limit
- **Progress feedback**: Shows scanning progress
- **Graceful degradation**: Continues with found projects if limits hit

### Example Output
```bash
sisi ~/huge-monorepo
# 🔍 Scanning projects... (47/100 directories)
# ⚠️  Large directory detected, limiting scan to 100 directories
# ✅ Found 12 projects in 0:28
```

## Customization

### Including Hidden Directories

sisi will find projects in hidden directories if they contain project files:

```bash
~/projects/
├── .experimental/    # Will be found if has package.json
│   └── package.json  # 📦 Node.js project
└── regular-app/
    └── package.json
```

### Nested Projects

sisi finds projects at any depth:

```bash
~/workspace/
├── company/
│   ├── frontend/     # 📦 Node.js
│   │   └── package.json
│   └── backend/
│       └── api/      # 🐍 Python
│           └── requirements.txt
└── personal/
    └── tools/
        └── backup/   # ⚙️ Rust
            └── Cargo.toml
```

## Troubleshooting Detection

### No Projects Found

**Problem**: `No projects found in /path/to/directory`

**Solutions**:
1. Verify project files exist:
   ```bash
   find ~/projects -name "package.json" -o -name "requirements.txt" \
     -o -name "Cargo.toml" -o -name "go.mod" -o -name "index.html"
   ```

2. Check directory permissions:
   ```bash
   ls -la ~/projects
   ```

3. Look for excluded patterns:
   ```bash
   # Move projects out of node_modules, .git, etc.
   ```

### Wrong Project Type

**Problem**: Project detected with wrong icon/type

**Cause**: Multiple project files present, priority system chooses first match

**Example**:
```bash
# Directory has both package.json and Cargo.toml
# Will be detected as 📦 Node.js (higher priority)
```

**Solution**: Remove or rename lower-priority files if not needed

### Performance Issues

**Problem**: Scanning takes too long

**Solutions**:
1. Use more specific paths:
   ```bash
   # Instead of:
   sisi ~
   
   # Use:
   sisi ~/projects/active
   ```

2. Clean up nested directories:
   ```bash
   # Remove deep node_modules, target directories
   find ~/projects -name "node_modules" -type d -exec rm -rf {} +
   ```

3. Check for symbolic links creating loops:
   ```bash
   find ~/projects -type l
   ```

## Advanced Examples

### Mixed Technology Stack
```bash
~/dev/microservices/
├── user-service/     # 📦 Node.js API
├── auth-service/     # ⚙️ Go service  
├── data-processor/   # 🐍 Python ML
├── admin-ui/         # 📦 React SPA
└── docs/            # 🌐 Static site
```

### Monorepo Structure  
```bash
~/work/platform/
├── packages/
│   ├── ui-lib/       # 📦 Component library
│   ├── utils/        # 📦 Utilities
│   └── themes/       # 📦 Design system
├── apps/
│   ├── web-app/      # 📦 Next.js app
│   ├── mobile/       # 📦 React Native
│   └── api/          # 📦 Express API
└── tools/
    ├── build/        # 📦 Build scripts
    └── deploy/       # 🐍 Deploy tools
```

## Next Steps

- **[Configuration](/docs/configuration)** - Advanced customization options
- **[Troubleshooting](/docs/troubleshooting)** - Solve common issues
- **[Usage](/docs/usage)** - Learn command workflows