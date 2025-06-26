import { jest } from '@jest/globals';
import { promises as fs } from 'fs';
import { join } from 'path';
import { refreshProjects } from '../refresh-projects.js';
import * as tmux from '../tmux.js';
import * as discovery from '../discovery.js';
import { Project } from '../types.js';

// Mock dependencies
jest.mock('../tmux.js');
jest.mock('../discovery.js');

const mockedTmux = tmux as jest.Mocked<typeof tmux>;
const mockedDiscovery = discovery as jest.Mocked<typeof discovery>;

describe('refresh-projects', () => {
  const testDir = '/tmp/test-refresh';
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Console.log and console.error mocks to avoid test output noise
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('refreshProjects', () => {
    const mockProjects: Project[] = [
      { name: 'project1', path: '/test/project1', type: 'node', icon: '📦' },
      { name: 'project2', path: '/test/project2', type: 'python', icon: '🐍' }
    ];

    it('should refresh projects when session exists', async () => {
      // Arrange
      mockedTmux.sessionExists.mockResolvedValue(true);
      mockedDiscovery.discoverProjects.mockResolvedValue(mockProjects);
      mockedTmux.updateProjectWindows.mockResolvedValue();

      // Act
      await refreshProjects(testDir);

      // Assert
      expect(mockedTmux.sessionExists).toHaveBeenCalled();
      expect(mockedDiscovery.discoverProjects).toHaveBeenCalledWith(testDir);
      expect(mockedTmux.updateProjectWindows).toHaveBeenCalledWith(mockProjects, testDir);
    });

    it('should exit with error when no session exists', async () => {
      // Arrange
      mockedTmux.sessionExists.mockResolvedValue(false);
      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });

      // Act & Assert
      await expect(refreshProjects(testDir)).rejects.toThrow('process.exit called');
      expect(mockExit).toHaveBeenCalledWith(1);
      expect(mockedDiscovery.discoverProjects).not.toHaveBeenCalled();
    });

    it('should exit with error when no directory provided and none detected', async () => {
      // Arrange
      mockedTmux.sessionExists.mockResolvedValue(true);
      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });

      // Act & Assert
      await expect(refreshProjects()).rejects.toThrow('process.exit called');
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should handle empty project list gracefully', async () => {
      // Arrange
      mockedTmux.sessionExists.mockResolvedValue(true);
      mockedDiscovery.discoverProjects.mockResolvedValue([]);

      // Act
      await refreshProjects(testDir);

      // Assert
      expect(mockedTmux.updateProjectWindows).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/No projects found/));
    });

    it('should handle discovery errors', async () => {
      // Arrange
      mockedTmux.sessionExists.mockResolvedValue(true);
      mockedDiscovery.discoverProjects.mockRejectedValue(new Error('Discovery failed'));
      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });

      // Act & Assert
      await expect(refreshProjects(testDir)).rejects.toThrow('process.exit called');
      expect(mockExit).toHaveBeenCalledWith(1);
      expect(console.error).toHaveBeenCalledWith(expect.stringMatching(/Failed to refresh projects/));
    });

    it('should handle tmux update errors', async () => {
      // Arrange
      mockedTmux.sessionExists.mockResolvedValue(true);
      mockedDiscovery.discoverProjects.mockResolvedValue(mockProjects);
      mockedTmux.updateProjectWindows.mockRejectedValue(new Error('Tmux update failed'));
      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });

      // Act & Assert
      await expect(refreshProjects(testDir)).rejects.toThrow('process.exit called');
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });
});