// tmux configuration template with key bindings
export const TMUX_CONFIG = `
# ═══════════════════════════════════════════════════════════════════
# Ultimate TMUX Configuration with sisi-cmux Integration
# Based on tmux-ultimate configuration
# ═══════════════════════════════════════════════════════════════════

# Reload configuration with Prefix + r
bind r source-file /tmp/sisi-tmux-config.conf \; display-message "Config reloaded!"

# ═══════════════════════════════════════════════════════════════════
# CORE SETTINGS
# ═══════════════════════════════════════════════════════════════════

# Enable mouse support
set -g mouse on

# ═══════════════════════════════════════════════════════════════════
# APPEARANCE & STATUS BAR
# ═══════════════════════════════════════════════════════════════════

# Pane border status - show current directory
set -g pane-border-status top
set -g pane-border-format '#P: #{b:pane_current_path}'

# Enable 256 colors
set -g default-terminal "screen-256color"

# Enable true color support
set -ga terminal-overrides ",*256col*:Tc"

# Dracula Color Scheme with sisi modifications
set -g status-bg '#44475a'
set -g status-fg '#f8f8f2'
set -g window-status-current-style 'bg=#bd93f9,fg=#282a36'
set -g pane-border-style 'fg=#6272a4'
set -g pane-active-border-style 'fg=#bd93f9,bg=#bd93f9'

# Status bar configuration with sisi integration
set -g status-left '#[fg=#bd93f9,bold]sisi #[fg=#f8f8f2][#S] '
set -g status-right '#[fg=#bd93f9]^B+Q:actions ^B+P:projects ^B+U:refresh #[fg=#f8f8f2]| %Y-%m-%d | %H:%M'
set -g status-left-length 50
set -g status-right-length 60
set -g status-justify centre

# Window status - hide window information for cleaner status bar
setw -g window-status-format ""
setw -g window-status-current-format ""

# ═══════════════════════════════════════════════════════════════════
# BEHAVIOR SETTINGS
# ═══════════════════════════════════════════════════════════════════

# History buffer size
set -g history-limit 5000

# Start windows and panes at 1, not 0
set -g base-index 1
setw -g pane-base-index 1

# Disable automatic window renaming
set-option -g allow-rename off
setw -g automatic-rename off

# Renumber windows when a window is closed
set -g renumber-windows on

# ═══════════════════════════════════════════════════════════════════
# KEY BINDINGS
# ═══════════════════════════════════════════════════════════════════

# Split panes using | and -
bind | split-window -h
bind - split-window -v
unbind '"'
unbind %

# Switch panes using Alt+arrow without prefix
bind -n M-Left select-pane -L
bind -n M-Right select-pane -R
bind -n M-Up select-pane -U
bind -n M-Down select-pane -D

# Vim-style pane navigation (preserved from sisi)
bind-key h select-pane -L
bind-key j select-pane -D
bind-key k select-pane -U
bind-key l select-pane -R

# Project navigation
bind-key n next-window
bind-key p previous-window
bind-key 1 select-window -t 1
bind-key 2 select-window -t 2
bind-key 3 select-window -t 3
bind-key 4 select-window -t 4
bind-key 5 select-window -t 5
bind-key 6 select-window -t 6
bind-key 7 select-window -t 7
bind-key 8 select-window -t 8
bind-key 9 select-window -t 9

# ═══════════════════════════════════════════════════════════════════
# SISI-CMUX KEY BINDINGS
# ═══════════════════════════════════════════════════════════════════

# sisi workspace management
bind-key P run-shell "node SCRIPT_DIR/project-selector.js"
bind-key C send-keys 'claude' C-m
bind-key S run-shell "node SCRIPT_DIR/stop-workspace.js"
bind-key U run-shell "echo 'Enter directory path to refresh:' && read dir && node SCRIPT_DIR/refresh-projects.js '$dir'"

# claude-checkpoint-restore keybindings
bind-key R send-keys 'claude-checkpoint-restore' C-m
bind-key M send-keys 'claude-checkpoint-save' C-m

# Project-specific command bindings
bind-key D run-shell "node SCRIPT_DIR/project-commands.js dev"
bind-key T run-shell "node SCRIPT_DIR/project-commands.js test"
bind-key B run-shell "node SCRIPT_DIR/project-commands.js build"

# Quick actions panel
bind-key Q run-shell "node SCRIPT_DIR/quick-actions.js"

# ═══════════════════════════════════════════════════════════════════
# END OF CONFIGURATION
# ═══════════════════════════════════════════════════════════════════
`;