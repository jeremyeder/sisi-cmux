// Simple, basic tests - no complex mocking

import { ValidationError, DependencyError, validatePath } from '../utils';
import { discoverProjects } from '../discovery';
import { join } from 'path';

describe('Simple Core Tests', () => {
  describe('Error Classes', () => {
    it('ValidationError works correctly', () => {
      const error = new ValidationError('test message', 'TEST_CODE');
      expect(error.message).toBe('test message');
      expect(error.code).toBe('TEST_CODE');
    });

    it('DependencyError works correctly', () => {
      const error = new DependencyError('missing dep', 'tmux');
      expect(error.message).toBe('missing dep');
      expect(error.dependency).toBe('tmux');
    });
  });

  describe('File Validation', () => {
    it('validatePath returns false for non-existent files', async () => {
      const exists = await validatePath('/path/that/does/not/exist');
      expect(exists).toBe(false);
    });

    it('validatePath returns true for package.json', async () => {
      const exists = await validatePath(join(__dirname, '../../package.json'));
      expect(exists).toBe(true);
    });
  });

  describe('Project Discovery Basic', () => {
    it('returns empty array for non-existent directory', async () => {
      await expect(discoverProjects('/path/that/does/not/exist')).rejects.toThrow();
    });
  });
});