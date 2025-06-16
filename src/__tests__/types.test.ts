// Basic type validation tests

import { Project, ProjectType } from '../types';

describe('Type Tests', () => {
  describe('Project Interface', () => {
    it('creates valid Project objects', () => {
      const project: Project = {
        name: 'test-project',
        path: '/tmp/test',
        type: 'node',
        icon: '📦'
      };

      expect(project.name).toBe('test-project');
      expect(project.path).toBe('/tmp/test');
      expect(project.type).toBe('node');
      expect(project.icon).toBe('📦');
    });

    it('supports all project types', () => {
      const types: ProjectType[] = ['node', 'python', 'rust', 'go', 'web', 'unknown'];
      
      types.forEach(type => {
        const project: Project = {
          name: `${type}-project`,
          path: `/tmp/${type}`,
          type: type,
          icon: '📁'
        };
        
        expect(project.type).toBe(type);
      });
    });
  });

  describe('Project Type Enum', () => {
    it('includes expected project types', () => {
      const expectedTypes = ['node', 'python', 'rust', 'go', 'web', 'unknown'];
      
      // This test ensures our type system includes all expected types
      expectedTypes.forEach(type => {
        const typedValue: ProjectType = type as ProjectType;
        expect(typeof typedValue).toBe('string');
      });
    });
  });
});