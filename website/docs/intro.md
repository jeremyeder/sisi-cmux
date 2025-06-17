---
sidebar_position: 1
---

# Getting Started

**Simple multi-project workspace manager with Claude Code integration**

Turn any directory into an organized tmux workspace. Auto-discovers your projects, creates windows for each one, and sets up Claude Code integration - all with one command.

## What is sisi-cmux?

sisi-cmux is a productivity tool that transforms the way you work with multiple projects. Instead of manually opening terminals and navigating between directories, sisi creates a structured tmux workspace that:

- **Auto-discovers** all your projects in a directory
- **Organizes** them into separate tmux windows
- **Detects project types** (Node.js, Python, Rust, Go, Web)
- **Integrates Claude AI** for instant coding assistance
- **Provides shortcuts** for fast project navigation

## Quick Start

```bash
# Install globally
npm install -g sisi-cmux

# Create workspace from your projects directory
sisi ~/projects

# Now you're in tmux with organized project windows!
```

## Requirements

- [tmux](https://tmux.github.io/) 2.0+
- [Claude CLI](https://claude.ai/code) (for AI integration)
- Node.js 18+ (for installation)

## Key Features

- ✅ **Zero configuration** - Works out of the box
- ✅ **Smart project discovery** - Detects 5+ project types
- ✅ **Performance optimized** - Handles large directories safely
- ✅ **Error recovery** - Graceful handling of missing dependencies
- ✅ **Claude integration** - One-key AI assistance
- ✅ **Session persistence** - Attach/detach like normal tmux

## What you'll learn

In this documentation, you'll discover:

1. **[Installation](/docs/installation)** - How to install and set up sisi-cmux
2. **[Usage](/docs/usage)** - Command reference and basic usage
3. **[Key Bindings](/docs/key-bindings)** - tmux shortcuts for productivity
4. **[Project Detection](/docs/project-detection)** - How projects are discovered and categorized
5. **[Configuration](/docs/configuration)** - Advanced customization options
6. **[Troubleshooting](/docs/troubleshooting)** - Common issues and solutions

Let's get started with installation!