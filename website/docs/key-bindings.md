---
sidebar_position: 4
---

# Key Bindings

Master the tmux shortcuts that make sisi-cmux productive.

## sisi-specific Bindings

These custom shortcuts are available inside your sisi workspace:

| Keys | Action | Description |
|------|--------|-------------|
| `Ctrl+b P` | **Project Selector** | Fuzzy search and switch between projects |
| `Ctrl+b C` | **Launch Claude** | Start Claude CLI in current project |
| `Ctrl+b R` | **Restore Checkpoint** | Run claude-checkpoint-restore |
| `Ctrl+b M` | **Save Checkpoint** | Run claude-checkpoint-save (Memory save) |
| `Ctrl+b S` | **Stop Workspace** | Clean shutdown of sisi workspace |

## Standard tmux Navigation

All standard tmux bindings work normally:

### Window Management
| Keys | Action |
|------|--------|
| `Ctrl+b 1-9` | Jump to project windows |
| `Ctrl+b n` | Next window |
| `Ctrl+b p` | Previous window |
| `Ctrl+b c` | Create new window |
| `Ctrl+b &` | Kill current window |
| `Ctrl+b ,` | Rename window |

### Session Management
| Keys | Action |
|------|--------|
| `Ctrl+b d` | Detach session |
| `Ctrl+b s` | Session selector |
| `Ctrl+b $` | Rename session |

### Pane Management
| Keys | Action |
|------|--------|
| `Ctrl+b %` | Split horizontally |
| `Ctrl+b "` | Split vertically |
| `Ctrl+b arrow` | Navigate panes |
| `Ctrl+b x` | Kill current pane |

## Usage Examples

### Quick Project Switching
```bash
# Start workspace
sisi ~/projects

# Inside tmux:
Ctrl+b P    # Opens project selector
# Type: "react" -> Enter
# Switches to react-app project window
```

### AI-Assisted Development
```bash
# Navigate to any project
Ctrl+b 2    # Go to project window 2

# Launch Claude for this project
Ctrl+b C    # Claude starts with project context

# Save and restore checkpoints
Ctrl+b M    # Save current state as checkpoint
Ctrl+b R    # Restore from checkpoint
```

### Clean Shutdown
```bash
# When done working
Ctrl+b S    # Stops workspace completely
# Alternative: sisi stop (from outside tmux)
```