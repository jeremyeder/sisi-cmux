// Basic smoke tests to verify core functionality

import { ValidationError, DependencyError } from '../utils';
import { Project } from '../types';

describe('Basic Type and Error Tests', () => {
  it('should create ValidationError with correct properties', () => {
    const error = new ValidationError('Test message', 'TEST_CODE');
    
    expect(error).toBeInstanceOf(ValidationError);
    expect(error.message).toBe('Test message');
    expect(error.code).toBe('TEST_CODE');
    expect(error.name).toBe('ValidationError');
  });

  it('should create DependencyError with correct properties', () => {
    const error = new DependencyError('Dependency missing', 'tmux');
    
    expect(error).toBeInstanceOf(DependencyError);
    expect(error.message).toBe('Dependency missing');
    expect(error.dependency).toBe('tmux');
    expect(error.name).toBe('DependencyError');
  });

  it('should create Project type correctly', () => {
    const project: Project = {
      name: 'test-project',
      path: '/tmp/test-project',
      type: 'node',
      icon: '📦'
    };

    expect(project.name).toBe('test-project');
    expect(project.type).toBe('node');
    expect(project.icon).toBe('📦');
    expect(project.path).toBe('/tmp/test-project');
  });

  it('should handle all project types', () => {
    const types: Array<Project['type']> = ['node', 'python', 'rust', 'go', 'web', 'unknown'];
    
    types.forEach(type => {
      const project: Project = {
        name: `${type}-project`,
        path: `/tmp/${type}-project`,
        type,
        icon: '📁'
      };
      
      expect(project.type).toBe(type);
    });
  });
});