// Type definitions matching GitHub Actions workflow schema

export interface TriggerConfig {
  push?: {
    branches?: string[];
    tags?: string[];
    paths?: string[];
    paths-ignore?: string[];
  };
  pull_request?: {
    branches?: string[];
    types?: string[];
    paths?: string[];
    paths-ignore?: string[];
  };
  schedule?: Array<{
    cron: string;
  }>;
  workflow_dispatch?: {
    inputs?: Record<string, {
      description: string;
      required: boolean;
      default?: string;
      type?: string;
    }>;
  };
  [key: string]: any;
}

export interface Permissions {
  actions?: 'read' | 'write' | 'none';
  checks?: 'read' | 'write' | 'none';
  contents?: 'read' | 'write' | 'none';
  deployments?: 'read' | 'write' | 'none';
  id-token?: 'read' | 'write' | 'none';
  issues?: 'read' | 'write' | 'none';
  discussions?: 'read' | 'write' | 'none';
  packages?: 'read' | 'write' | 'none';
  pages?: 'read' | 'write' | 'none';
  pull-requests?: 'read' | 'write' | 'none';
  repository-projects?: 'read' | 'write' | 'none';
  security-events?: 'read' | 'write' | 'none';
  statuses?: 'read' | 'write' | 'none';
}

export interface Step {
  id: string;
  name?: string;
  uses?: string;
  with?: Record<string, any>;
  run?: string;
  shell?: string;
  env?: Record<string, string>;
  if?: string;
  continue-on-error?: boolean;
  timeout-minutes?: number;
  working-directory?: string;
}

export interface Job {
  id: string;
  name?: string;
  'runs-on': string;
  needs?: string[];
  if?: string;
  steps: Step[];
  outputs?: Record<string, string>;
  env?: Record<string, string>;
  defaults?: {
    run?: {
      shell?: string;
      working-directory?: string;
    };
  };
  timeout-minutes?: number;
  strategy?: {
    matrix?: Record<string, any[]>;
    fail-fast?: boolean;
    max-parallel?: number;
  };
  continue-on-error?: boolean;
  container?: {
    image: string;
    env?: Record<string, string>;
    ports?: number[];
    volumes?: string[];
    options?: string;
  };
  services?: Record<string, any>;
}

export interface Workflow {
  id?: string;
  name?: string;
  on: TriggerConfig;
  permissions?: Permissions;
  env?: Record<string, string>;
  jobs: Record<string, Job>;
  concurrency?: {
    group?: string;
    'cancel-in-progress'?: boolean;
  };
}

// UI-specific types
export interface SelectedNode {
  type: 'job' | 'step' | 'trigger' | null;
  jobId?: string;
  stepId?: string;
}

export interface WorkflowState {
  workflow: Workflow;
  selectedNode: SelectedNode;
  history: Workflow[];
  historyIndex: number;
}

