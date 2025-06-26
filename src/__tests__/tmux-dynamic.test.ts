import { jest } from '@jest/globals';
import { spawn } from 'child_process';
import { EventEmitter } from 'events';
import { addWindow, removeWindow, updateProjectWindows, refreshStatusBar, listWindows } from '../tmux.js';
import { Project } from '../types.js';

// Mock child_process
jest.mock('child_process');
const mockedSpawn = spawn as jest.MockedFunction<typeof spawn>;

describe('tmux dynamic window management', () => {
  let mockProcess: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock console methods to avoid test output noise
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Create a mock child process
    mockProcess = new EventEmitter();
    mockProcess.stdout = new EventEmitter();
    mockProcess.stderr = new EventEmitter();
    mockProcess.kill = jest.fn();
    
    mockedSpawn.mockReturnValue(mockProcess as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('addWindow', () => {
    const testProject: Project = {
      name: 'test-project',
      path: '/path/to/project',
      type: 'node',
      icon: '📦'
    };

    it('should add a new window successfully', async () => {
      // Arrange
      const addWindowPromise = addWindow(testProject);

      // Simulate successful tmux command
      setTimeout(() => {
        mockProcess.emit('close', 0);
      }, 10);

      // Act & Assert
      await expect(addWindowPromise).resolves.toBeUndefined();
      expect(mockedSpawn).toHaveBeenCalledWith('tmux', [
        'new-window', '-t', 'sisi-workspace',
        '-n', '📦test-project',
        '-c', '/path/to/project'
      ], { stdio: ['pipe', 'pipe', 'pipe'] });
    });

    it('should handle tmux command failure', async () => {
      // Arrange
      const addWindowPromise = addWindow(testProject);

      // Simulate tmux command failure
      setTimeout(() => {
        mockProcess.stderr.emit('data', 'Window creation failed');
        mockProcess.emit('close', 1);
      }, 10);

      // Act & Assert
      await expect(addWindowPromise).rejects.toThrow('Failed to add window for test-project');
    });

    it('should handle tmux process error', async () => {
      // Arrange
      const addWindowPromise = addWindow(testProject);

      // Simulate process error
      setTimeout(() => {
        mockProcess.emit('error', new Error('Process failed'));
      }, 10);

      // Act & Assert
      await expect(addWindowPromise).rejects.toThrow('Failed to add window for test-project');
    });
  });

  describe('removeWindow', () => {
    it('should remove a window successfully', async () => {
      // Mock listWindows to return existing windows
      const mockListWindows = jest.fn().mockResolvedValue([
        { index: 1, name: '📦test-project', active: false },
        { index: 2, name: '🐍another-project', active: true }
      ]);
      
      // Replace the listWindows import in the module
      jest.doMock('../tmux.js', () => ({
        ...jest.requireActual('../tmux.js'),
        listWindows: mockListWindows
      }));

      // Arrange
      const removeWindowPromise = removeWindow('test-project');

      // Simulate successful tmux command
      setTimeout(() => {
        mockProcess.emit('close', 0);
      }, 10);

      // Act & Assert
      await expect(removeWindowPromise).resolves.toBeUndefined();
      expect(mockedSpawn).toHaveBeenCalledWith('tmux', [
        'kill-window', '-t', 'sisi-workspace:1'
      ], { stdio: ['pipe', 'pipe', 'pipe'] });
    });

    it('should handle window not found gracefully', async () => {
      // Mock listWindows to return no matching windows
      const mockListWindows = jest.fn().mockResolvedValue([
        { index: 2, name: '🐍another-project', active: true }
      ]);
      
      jest.doMock('../tmux.js', () => ({
        ...jest.requireActual('../tmux.js'),
        listWindows: mockListWindows
      }));

      // Act & Assert
      await expect(removeWindow('nonexistent-project')).resolves.toBeUndefined();
      expect(mockedSpawn).not.toHaveBeenCalled();
    });
  });

  describe('updateProjectWindows', () => {
    const currentProjects: Project[] = [
      { name: 'existing-project', path: '/path/existing', type: 'node', icon: '📦' },
      { name: 'new-project', path: '/path/new', type: 'python', icon: '🐍' }
    ];

    it('should add new projects and remove old ones', async () => {
      // Mock listWindows to return current state
      const mockListWindows = jest.fn().mockResolvedValue([
        { index: 1, name: '📦existing-project', active: false },
        { index: 2, name: '⚙️old-project', active: false }
      ]);

      jest.doMock('../tmux.js', () => ({
        ...jest.requireActual('../tmux.js'),
        listWindows: mockListWindows
      }));

      // Arrange
      const updatePromise = updateProjectWindows(currentProjects, '/test/dir');

      // Simulate successful tmux commands
      setTimeout(() => {
        mockProcess.emit('close', 0);
      }, 10);

      // Act & Assert
      await expect(updatePromise).resolves.toBeUndefined();
      
      // Should have been called for adding new project and removing old project
      expect(mockedSpawn).toHaveBeenCalledWith('tmux', expect.arrayContaining([
        'new-window', '-t', 'sisi-workspace'
      ]), { stdio: ['pipe', 'pipe', 'pipe'] });
    });

    it('should handle no changes gracefully', async () => {
      // Mock listWindows to return matching projects
      const mockListWindows = jest.fn().mockResolvedValue([
        { index: 1, name: '📦existing-project', active: false },
        { index: 2, name: '🐍new-project', active: false }
      ]);

      jest.doMock('../tmux.js', () => ({
        ...jest.requireActual('../tmux.js'),
        listWindows: mockListWindows
      }));

      // Act & Assert
      await expect(updateProjectWindows(currentProjects, '/test/dir')).resolves.toBeUndefined();
      expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/No project changes detected/));
    });
  });

  describe('refreshStatusBar', () => {
    it('should refresh status bar successfully', async () => {
      // Arrange
      const refreshPromise = refreshStatusBar();

      // Simulate successful tmux command
      setTimeout(() => {
        mockProcess.emit('close', 0);
      }, 10);

      // Act & Assert
      await expect(refreshPromise).resolves.toBeUndefined();
      expect(mockedSpawn).toHaveBeenCalledWith('tmux', [
        'refresh-client', '-S'
      ], { stdio: ['pipe', 'pipe', 'pipe'] });
    });

    it('should handle refresh errors gracefully', async () => {
      // Arrange
      const refreshPromise = refreshStatusBar();

      // Simulate tmux command failure
      setTimeout(() => {
        mockProcess.stderr.emit('data', 'Refresh failed');
        mockProcess.emit('close', 1);
      }, 10);

      // Act & Assert
      await expect(refreshPromise).resolves.toBeUndefined();
      expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/Warning: Failed to refresh status bar/));
    });
  });

  describe('listWindows', () => {
    it('should parse window list correctly', async () => {
      // Arrange
      const listPromise = listWindows();

      // Simulate successful tmux command with window data
      setTimeout(() => {
        mockProcess.stdout.emit('data', '1:📦project1:0\n2:🐍project2:1\n');
        mockProcess.emit('close', 0);
      }, 10);

      // Act
      const result = await listPromise;

      // Assert
      expect(result).toEqual([
        { index: 1, name: '📦project1', active: false },
        { index: 2, name: '🐍project2', active: true }
      ]);
    });

    it('should return empty array on tmux error', async () => {
      // Arrange
      const listPromise = listWindows();

      // Simulate tmux command failure
      setTimeout(() => {
        mockProcess.emit('close', 1);
      }, 10);

      // Act
      const result = await listPromise;

      // Assert
      expect(result).toEqual([]);
    });
  });
});