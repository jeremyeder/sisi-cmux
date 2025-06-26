// tmux configuration template with key bindings
export const TMUX_CONFIG = `
# General tmux settings
set -g default-terminal "screen-256color"
set -g mouse on
set -g history-limit 10000
set -g base-index 1
setw -g pane-base-index 1

# Key bindings for navigation
bind-key | split-window -h
bind-key - split-window -v
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

# sisi key bindings
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

# Status bar - clean design showing current project
set -g status-bg "#4d4d4d"
set -g status-fg "#ffffff"
set -g status-left-length 20
set -g status-left "#[fg=#7f317f,bold]sisi "
set -g status-right-length 50
set -g status-right "#[fg=#7f317f]^B+Q:actions ^B+P:projects ^B+U:refresh ^B+S:stop"
set -g status-interval 5
set -g status-justify centre

# Window status - show current project only
setw -g window-status-format ""
setw -g window-status-current-format " #[fg=#ffffff,bg=#7f317f,bold]▶ #W#[fg=default,bg=default,nobold] #[fg=#666666][#{session_windows} total]#[fg=default] "
`;