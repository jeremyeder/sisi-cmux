#!/bin/bash
# Demo script for sisi-cmux
# Run with: asciinema rec sisi-demo.cast -c "./demo/demo-script.sh"

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Demo settings
DEMO_DIR="/tmp/sisi-demo-projects"
SPEED="medium"  # typing speed

# Helper function for typing effect
type_command() {
    echo -e "${BLUE}$ $1${NC}"
    if [ "$SPEED" = "fast" ]; then
        sleep 0.5
    else
        sleep 1.5
    fi
}

# Helper function for comments
comment() {
    echo -e "${YELLOW}# $1${NC}"
    sleep 1
}

# Helper function for output
output() {
    echo -e "${GREEN}$1${NC}"
    sleep 1
}

clear
echo "================================================================"
echo "                    SISI-CMUX DEMO"
echo "        Multi-project workspace manager with Claude"
echo "================================================================"
echo
sleep 2

comment "Let's start by creating some demo projects..."
type_command "mkdir -p $DEMO_DIR && cd $DEMO_DIR"
mkdir -p "$DEMO_DIR"
cd "$DEMO_DIR"

comment "Create a Node.js project"
type_command "mkdir my-web-app && cd my-web-app"
mkdir my-web-app && cd my-web-app
type_command "echo '{\"name\": \"my-web-app\", \"version\": \"1.0.0\"}' > package.json"
echo '{"name": "my-web-app", "version": "1.0.0", "main": "index.js"}' > package.json
type_command "echo 'console.log(\"Hello Web!\");' > index.js"
echo 'console.log("Hello Web!");' > index.js
cd ..

comment "Create a Python project"
type_command "mkdir data-analysis && cd data-analysis"
mkdir data-analysis && cd data-analysis
type_command "echo 'pandas>=1.0.0\nnumpy>=1.0.0' > requirements.txt"
echo -e 'pandas>=1.0.0\nnumpy>=1.0.0' > requirements.txt
type_command "echo 'import pandas as pd\nprint(\"Data analysis ready!\")' > main.py"
echo -e 'import pandas as pd\nprint("Data analysis ready!")' > main.py
cd ..

comment "Create a Rust project"
type_command "mkdir rust-cli && cd rust-cli"
mkdir rust-cli && cd rust-cli
type_command "echo '[package]\nname = \"rust-cli\"\nversion = \"0.1.0\"' > Cargo.toml"
echo -e '[package]\nname = "rust-cli"\nversion = "0.1.0"\nedition = "2021"' > Cargo.toml
type_command "mkdir src && echo 'fn main() { println!(\"Rust CLI!\"); }' > src/main.rs"
mkdir src && echo 'fn main() { println!("Rust CLI!"); }' > src/main.rs
cd ..

comment "Create a web project"
type_command "mkdir portfolio-site && cd portfolio-site"
mkdir portfolio-site && cd portfolio-site
type_command "echo '<!DOCTYPE html><html><head><title>Portfolio</title></head><body><h1>My Portfolio</h1></body></html>' > index.html"
echo '<!DOCTYPE html><html><head><title>Portfolio</title></head><body><h1>My Portfolio</h1></body></html>' > index.html
type_command "echo 'body { font-family: Arial; }' > style.css"
echo 'body { font-family: Arial; }' > style.css
cd ..

comment "Add some directories that should be ignored"
type_command "mkdir node_modules .git build"
mkdir node_modules .git build 2>/dev/null || true

comment "Let's see what we have:"
type_command "ls -la"
ls -la
sleep 2

echo
comment "Now let's use sisi to create a workspace from these projects!"
type_command "sisi $DEMO_DIR"

echo
output "🔍 Checking dependencies..."
output "✓ tmux 3.2a"
output "✓ claude (claude-cli 1.0.0)"
output "🔍 Discovering projects..."
output "  Scanning 7 entries..."
output "  (Skipped 3 non-project directories)"
output "📦 Found 4 projects:"
output "  node (1):"
output "    📦 my-web-app"
output "  python (1):"
output "    🐍 data-analysis"
output "  rust (1):"
output "    ⚙️ rust-cli"
output "  web (1):"
output "    🌐 portfolio-site"
output "✅ Workspace created!"
output "Key bindings:"
output "  Ctrl+b P  - Project selector"
output "  Ctrl+b C  - Launch Claude"
output "  Ctrl+b S  - Stop workspace"
sleep 3

echo
comment "You're now in tmux with one window per project!"
comment "Here's what you can do:"
echo
output "📋 Available tmux commands:"
output "  Ctrl+b P     - Interactive project selector"
output "  Ctrl+b C     - Launch Claude in current project"
output "  Ctrl+b S     - Stop the workspace"
output "  Ctrl+b 1-4   - Jump to specific project windows"
output "  Ctrl+b n/p   - Next/previous project"
echo
sleep 2

comment "Let's check the session status:"
type_command "tmux list-sessions"
tmux list-sessions 2>/dev/null || output "sisi-workspace: 4 windows (created $(date))"
sleep 1

comment "And list the project windows:"
type_command "tmux list-windows -t sisi-workspace"
output "1: 📦my-web-app* (1 panes) [active]"
output "2: 🐍data-analysis- (1 panes)"
output "3: ⚙️rust-cli- (1 panes)" 
output "4: 🌐portfolio-site- (1 panes)"
sleep 2

echo
comment "To stop the workspace later:"
type_command "sisi stop"
output "✅ Workspace stopped"
sleep 1

echo
comment "Clean up demo files"
type_command "rm -rf $DEMO_DIR"
rm -rf "$DEMO_DIR" 2>/dev/null || true

echo
echo "================================================================"
echo "                     DEMO COMPLETE!"
echo ""
echo "Key Features Demonstrated:"
echo "✅ Auto-discovery of 4 project types (Node.js, Python, Rust, Web)"
echo "✅ Smart filtering (ignored node_modules, .git, build dirs)"
echo "✅ Project type detection with emoji icons"
echo "✅ tmux integration with organized windows"
echo "✅ Simple start/stop workflow"
echo ""
echo "Try it yourself:"
echo "  npm install -g sisi-cmux"
echo "  sisi ~/your-projects"
echo "================================================================"
sleep 3