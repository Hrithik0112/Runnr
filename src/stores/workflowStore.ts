import { create } from 'zustand';
import { Workflow, Job, Step, SelectedNode, TriggerConfig } from '../types/workflow';

interface WorkflowState {
  workflow: Workflow;
  selectedNode: SelectedNode;
  history: Workflow[];
  historyIndex: number;
  
  // Actions
  setWorkflow: (workflow: Workflow) => void;
  addJob: (job: Job) => void;
  updateJob: (jobId: string, updates: Partial<Job>) => void;
  deleteJob: (jobId: string) => void;
  addStep: (jobId: string, step: Step) => void;
  updateStep: (jobId: string, stepId: string, updates: Partial<Step>) => void;
  deleteStep: (jobId: string, stepId: string) => void;
  updateTrigger: (trigger: TriggerConfig) => void;
  setSelectedNode: (node: SelectedNode) => void;
  
  // History actions
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const createEmptyWorkflow = (): Workflow => ({
  name: 'Untitled Workflow',
  on: {
    push: {
      branches: ['main']
    }
  },
  jobs: {}
});

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  workflow: createEmptyWorkflow(),
  selectedNode: { type: null },
  history: [createEmptyWorkflow()],
  historyIndex: 0,
  canUndo: false,
  canRedo: false,

  setWorkflow: (workflow) => {
    const { history, historyIndex } = get();
    // Limit history to 50 entries to prevent memory issues
    const maxHistory = 50;
    const newHistory = [...history.slice(0, historyIndex + 1), workflow].slice(-maxHistory);
    const newIndex = Math.min(newHistory.length - 1, historyIndex + 1);
    
    set({ 
      workflow,
      history: newHistory,
      historyIndex: newIndex,
      canUndo: newIndex > 0,
      canRedo: newIndex < newHistory.length - 1
    });
  },

  addJob: (job) => {
    const currentWorkflow = get().workflow;
    const updatedWorkflow: Workflow = {
      ...currentWorkflow,
      jobs: {
        ...currentWorkflow.jobs,
        [job.id]: job
      }
    };
    get().setWorkflow(updatedWorkflow);
  },

  updateJob: (jobId, updates) => {
    const currentWorkflow = get().workflow;
    const job = currentWorkflow.jobs[jobId];
    if (!job) return;

    const updatedJob: Job = {
      ...job,
      ...updates
    };

    const updatedWorkflow: Workflow = {
      ...currentWorkflow,
      jobs: {
        ...currentWorkflow.jobs,
        [jobId]: updatedJob
      }
    };
    get().setWorkflow(updatedWorkflow);
  },

  deleteJob: (jobId) => {
    const currentWorkflow = get().workflow;
    const { [jobId]: deleted, ...remainingJobs } = currentWorkflow.jobs;
    
    // Remove this job from any 'needs' arrays in other jobs
    const cleanedJobs = Object.entries(remainingJobs).reduce((acc, [id, job]) => {
      acc[id] = {
        ...job,
        needs: job.needs?.filter(n => n !== jobId)
      };
      return acc;
    }, {} as Record<string, Job>);

    const updatedWorkflow: Workflow = {
      ...currentWorkflow,
      jobs: cleanedJobs
    };
    get().setWorkflow(updatedWorkflow);
    
    // Clear selection if deleted job was selected
    if (get().selectedNode.jobId === jobId) {
      set({ selectedNode: { type: null } });
    }
  },

  addStep: (jobId, step) => {
    const currentWorkflow = get().workflow;
    const job = currentWorkflow.jobs[jobId];
    if (!job) return;

    const updatedJob: Job = {
      ...job,
      steps: [...job.steps, step]
    };

    const updatedWorkflow: Workflow = {
      ...currentWorkflow,
      jobs: {
        ...currentWorkflow.jobs,
        [jobId]: updatedJob
      }
    };
    get().setWorkflow(updatedWorkflow);
  },

  updateStep: (jobId, stepId, updates) => {
    const currentWorkflow = get().workflow;
    const job = currentWorkflow.jobs[jobId];
    if (!job) return;

    const updatedSteps = job.steps.map(step =>
      step.id === stepId ? { ...step, ...updates } : step
    );

    const updatedJob: Job = {
      ...job,
      steps: updatedSteps
    };

    const updatedWorkflow: Workflow = {
      ...currentWorkflow,
      jobs: {
        ...currentWorkflow.jobs,
        [jobId]: updatedJob
      }
    };
    get().setWorkflow(updatedWorkflow);
  },

  deleteStep: (jobId, stepId) => {
    const currentWorkflow = get().workflow;
    const job = currentWorkflow.jobs[jobId];
    if (!job) return;

    const updatedJob: Job = {
      ...job,
      steps: job.steps.filter(step => step.id !== stepId)
    };

    const updatedWorkflow: Workflow = {
      ...currentWorkflow,
      jobs: {
        ...currentWorkflow.jobs,
        [jobId]: updatedJob
      }
    };
    get().setWorkflow(updatedWorkflow);
    
    // Clear selection if deleted step was selected
    if (get().selectedNode.jobId === jobId && get().selectedNode.stepId === stepId) {
      set({ selectedNode: { type: null } });
    }
  },

  updateTrigger: (trigger) => {
    const currentWorkflow = get().workflow;
    const updatedWorkflow: Workflow = {
      ...currentWorkflow,
      on: trigger
    };
    get().setWorkflow(updatedWorkflow);
  },

  setSelectedNode: (node) => {
    set({ selectedNode: node });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      set({
        workflow: history[newIndex],
        historyIndex: newIndex,
        canUndo: newIndex > 0,
        canRedo: true
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      set({
        workflow: history[newIndex],
        historyIndex: newIndex,
        canUndo: true,
        canRedo: newIndex < history.length - 1
      });
    }
  }
}));

