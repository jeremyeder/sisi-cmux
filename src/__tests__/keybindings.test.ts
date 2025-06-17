// Tests for claude-checkpoint-restore keybindings

import { TMUX_CONFIG } from '../tmux-config';

describe('Claude Checkpoint Keybindings Tests', () => {
  describe('TMUX_CONFIG keybindings', () => {
    it('includes claude-checkpoint-restore keybinding', () => {
      expect(TMUX_CONFIG).toContain("bind-key R send-keys 'claude-checkpoint-restore' C-m");
    });

    it('includes claude-checkpoint-save keybinding', () => {
      expect(TMUX_CONFIG).toContain("bind-key M send-keys 'claude-checkpoint-save' C-m");
    });

    it('includes restore keybinding in status bar', () => {
      expect(TMUX_CONFIG).toContain('^B+R:restore');
    });

    it('includes save keybinding in status bar', () => {
      expect(TMUX_CONFIG).toContain('^B+M:save');
    });

    it('has adequate status bar length for all keybindings', () => {
      expect(TMUX_CONFIG).toContain('set -g status-right-length 50');
    });

    it('maintains existing keybindings', () => {
      expect(TMUX_CONFIG).toContain("bind-key P run-shell");
      expect(TMUX_CONFIG).toContain("bind-key C send-keys 'claude' C-m");
      expect(TMUX_CONFIG).toContain("bind-key S run-shell");
    });
  });

  describe('Keybinding format validation', () => {
    it('uses correct tmux keybinding syntax', () => {
      const lines = TMUX_CONFIG.split('\n');
      const restoreBinding = lines.find(line => line.includes('bind-key R'));
      const saveBinding = lines.find(line => line.includes('bind-key M'));
      
      expect(restoreBinding).toMatch(/^bind-key R send-keys '.*' C-m$/);
      expect(saveBinding).toMatch(/^bind-key M send-keys '.*' C-m$/);
    });

    it('commands are properly quoted', () => {
      expect(TMUX_CONFIG).toContain("'claude-checkpoint-restore'");
      expect(TMUX_CONFIG).toContain("'claude-checkpoint-save'");
    });
  });
});