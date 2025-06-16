# Sisi-CMUX Demo

This directory contains demo materials for creating an asciinema recording of sisi-cmux.

## Quick Demo Recording

```bash
# Install asciinema (if not already installed)
brew install asciinema
# or: pip install asciinema

# Record the demo
cd sisi-cmux
asciinema rec demo/sisi-demo.cast -c "./demo/demo-script.sh"

# Play back the recording
asciinema play demo/sisi-demo.cast

# Upload to asciinema.org (optional)
asciinema upload demo/sisi-demo.cast
```

## Manual Demo Steps

If you want to record manually instead of using the script:

### 1. Setup Demo Projects
```bash
mkdir /tmp/demo-projects && cd /tmp/demo-projects

# Node.js project
mkdir my-web-app && cd my-web-app
echo '{"name": "my-web-app", "version": "1.0.0"}' > package.json
echo 'console.log("Hello Web!");' > index.js
cd ..

# Python project
mkdir data-analysis && cd data-analysis
echo -e 'pandas>=1.0.0\nnumpy>=1.0.0' > requirements.txt
echo 'import pandas as pd' > main.py
cd ..

# Rust project
mkdir rust-cli && cd rust-cli
echo -e '[package]\nname = "rust-cli"\nversion = "0.1.0"' > Cargo.toml
mkdir src && echo 'fn main() { println!("Hello Rust!"); }' > src/main.rs
cd ..

# Web project
mkdir portfolio && cd portfolio
echo '<!DOCTYPE html><html><body><h1>Portfolio</h1></body></html>' > index.html
cd ..
```

### 2. Demonstrate Sisi
```bash
# Show the projects
ls -la

# Start sisi
sisi /tmp/demo-projects

# Inside tmux, demonstrate:
# - Ctrl+b P (project selector)
# - Ctrl+b 1-4 (window navigation)
# - Ctrl+b C (Claude integration)
# - Ctrl+b S (stop workspace)
```

### 3. Recording Tips

- **Terminal size**: Use 80x24 or 100x30 for best compatibility
- **Typing speed**: Pause between commands for readability
- **Narration**: Add comments explaining what's happening
- **Clean output**: Clear terminal before starting
- **Duration**: Keep it under 2-3 minutes for engagement

## Demo Script Features

The automated script demonstrates:

✅ **Project Discovery**
- Creates 4 different project types
- Shows auto-detection of Node.js, Python, Rust, Web
- Demonstrates filtering of build directories

✅ **Sisi Workflow**
- Dependency checking
- Project scanning with progress
- Workspace creation
- Key binding explanations

✅ **Visual Appeal**
- Color-coded output
- Project type emojis
- Clear status messages
- Organized project listing

## Alternative: Live Demo

For conferences or presentations, you can also do a live demo:

1. **Pre-setup**: Have demo projects ready in ~/demo-projects
2. **Backup plan**: Have the asciinema recording as fallback
3. **Interactive**: Let audience suggest project types to add
4. **Show tmux**: Demonstrate actual key bindings live

## Publishing the Demo

Once recorded, you can:

- **Embed in README**: `[![asciicast](https://asciinema.org/a/your-id.svg)](https://asciinema.org/a/your-id)`
- **Share URL**: Direct link to asciinema.org recording
- **Download GIF**: Use `svg-term` to convert to animated GIF
- **Include in docs**: Add to project documentation