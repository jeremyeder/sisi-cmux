export interface Project {
  name: string;
  path: string;
  type: ProjectType;
  icon: string;
}

export type ProjectType = 'node' | 'python' | 'rust' | 'go' | 'web' | 'unknown';

export interface WorkspaceConfig {
  sessionName: string;
  excludePatterns: string[];
}