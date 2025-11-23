import { useWorkflowStore } from '../../stores/workflowStore'
import { useState } from 'react'

interface StepEditorProps {
  jobId: string
}

export default function StepEditor({ jobId }: StepEditorProps) {
  const addStep = useWorkflowStore((state) => state.addStep)
  const setSelectedNode = useWorkflowStore((state) => state.setSelectedNode)

  const [stepType, setStepType] = useState<'action' | 'run'>('run')
  const [name, setName] = useState('')
  const [uses, setUses] = useState('')
  const [run, setRun] = useState('')
  const [ifCondition, setIfCondition] = useState('')

  const handleAddStep = () => {
    const stepId = `step_${Date.now()}`
    
    const step: any = {
      id: stepId,
    }

    if (name.trim()) {
      step.name = name.trim()
    }

    if (stepType === 'action' && uses.trim()) {
      step.uses = uses.trim()
    } else if (stepType === 'run' && run.trim()) {
      step.run = run.trim()
    }

    if (ifCondition.trim()) {
      step.if = ifCondition.trim()
    }

    // Only add if we have at least uses or run
    if (step.uses || step.run) {
      addStep(jobId, step)
      
      // Reset form
      setName('')
      setUses('')
      setRun('')
      setIfCondition('')
      setStepType('run')
      
      // Select the new step
      setSelectedNode({ type: 'step', jobId, stepId })
    }
  }

  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Add Step</h3>
      </div>

      {/* Step Type */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Step Type
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="run"
              checked={stepType === 'run'}
              onChange={(e) => setStepType(e.target.value as 'action' | 'run')}
              className="mr-2"
            />
            <span className="text-sm text-slate-700">Run Command</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="action"
              checked={stepType === 'action'}
              onChange={(e) => setStepType(e.target.value as 'action' | 'run')}
              className="mr-2"
            />
            <span className="text-sm text-slate-700">Action</span>
          </label>
        </div>
      </div>

      {/* Step Name */}
      <div>
        <label htmlFor="new-step-name" className="block text-sm font-medium text-slate-700 mb-2">
          Step Name (Optional)
        </label>
        <input
          id="new-step-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Optional step name"
          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-slate-700"
        />
      </div>

      {/* Uses (Action) */}
      {stepType === 'action' && (
        <div>
          <label htmlFor="new-step-uses" className="block text-sm font-medium text-slate-700 mb-2">
            Action (uses) *
          </label>
          <input
            id="new-step-uses"
            type="text"
            value={uses}
            onChange={(e) => setUses(e.target.value)}
            placeholder="actions/checkout@v4"
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-slate-700 font-mono text-sm"
          />
        </div>
      )}

      {/* Run (Command) */}
      {stepType === 'run' && (
        <div>
          <label htmlFor="new-step-run" className="block text-sm font-medium text-slate-700 mb-2">
            Run Command *
          </label>
          <textarea
            id="new-step-run"
            value={run}
            onChange={(e) => setRun(e.target.value)}
            placeholder="npm install"
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-slate-700 font-mono text-sm"
          />
        </div>
      )}

      {/* Condition (If) */}
      <div>
        <label htmlFor="new-step-if" className="block text-sm font-medium text-slate-700 mb-2">
          Condition (if) - Optional
        </label>
        <input
          id="new-step-if"
          type="text"
          value={ifCondition}
          onChange={(e) => setIfCondition(e.target.value)}
          placeholder="github.ref == 'refs/heads/main'"
          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-slate-700 font-mono text-sm"
        />
      </div>

      {/* Add Button */}
      <button
        onClick={handleAddStep}
        disabled={(stepType === 'action' && !uses.trim()) || (stepType === 'run' && !run.trim())}
        className="w-full px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
      >
        Add Step
      </button>
    </div>
  )
}

