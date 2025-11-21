import { useWorkflowStore } from '../../stores/workflowStore'
import { useMemo } from 'react'

interface StepInspectorProps {
  jobId: string
  stepId: string
}

export default function StepInspector({ jobId, stepId }: StepInspectorProps) {
  const workflow = useWorkflowStore((state) => state.workflow)
  const updateStep = useWorkflowStore((state) => state.updateStep)
  const deleteStep = useWorkflowStore((state) => state.deleteStep)
  const setSelectedNode = useWorkflowStore((state) => state.setSelectedNode)

  const job = workflow.jobs[jobId]
  const step = job?.steps.find(s => s.id === stepId)

  if (!job || !step) {
    return (
      <div className="p-4 text-sm text-red-600">
        Step not found
      </div>
    )
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateStep(jobId, stepId, { name: e.target.value || undefined })
  }

  const handleUsesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    if (value) {
      updateStep(jobId, stepId, { uses: value, run: undefined })
    } else {
      updateStep(jobId, stepId, { uses: undefined })
    }
  }

  const handleRunChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.trim()
    if (value) {
      updateStep(jobId, stepId, { run: value, uses: undefined })
    } else {
      updateStep(jobId, stepId, { run: undefined })
    }
  }

  const handleIfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    updateStep(jobId, stepId, { if: value || undefined })
  }

  const handleDelete = () => {
    deleteStep(jobId, stepId)
    setSelectedNode({ type: 'job', jobId })
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Step Properties</h3>
        <button
          onClick={handleDelete}
          className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
        >
          Delete
        </button>
      </div>

      {/* Step Name */}
      <div>
        <label htmlFor="step-name" className="block text-sm font-medium text-gray-700 mb-2">
          Step Name
        </label>
        <input
          id="step-name"
          type="text"
          value={step.name || ''}
          onChange={handleNameChange}
          placeholder="Optional step name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Optional display name for this step
        </p>
      </div>

      {/* Uses (Action) */}
      <div>
        <label htmlFor="step-uses" className="block text-sm font-medium text-gray-700 mb-2">
          Action (uses)
        </label>
        <input
          id="step-uses"
          type="text"
          value={step.uses || ''}
          onChange={handleUsesChange}
          placeholder="actions/checkout@v4"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
        />
        <p className="mt-1 text-xs text-gray-500">
          GitHub Action to use (e.g., actions/checkout@v4). Leave empty to use run command instead.
        </p>
      </div>

      {/* Run (Command) */}
      <div>
        <label htmlFor="step-run" className="block text-sm font-medium text-gray-700 mb-2">
          Run Command
        </label>
        <textarea
          id="step-run"
          value={step.run || ''}
          onChange={handleRunChange}
          placeholder="npm install"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
        />
        <p className="mt-1 text-xs text-gray-500">
          Shell command to run. Leave empty if using an action.
        </p>
      </div>

      {/* Condition (If) */}
      <div>
        <label htmlFor="step-if" className="block text-sm font-medium text-gray-700 mb-2">
          Condition (if)
        </label>
        <input
          id="step-if"
          type="text"
          value={step.if || ''}
          onChange={handleIfChange}
          placeholder="github.ref == 'refs/heads/main'"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
        />
        <p className="mt-1 text-xs text-gray-500">
          Optional condition expression. Step runs only if condition is true.
        </p>
      </div>

      {/* Step Info */}
      <div className="pt-4 border-t border-gray-200">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Step ID:</span>
            <span className="font-mono text-gray-900">{step.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Type:</span>
            <span className="text-gray-900">
              {step.uses ? 'Action' : step.run ? 'Run Command' : 'Empty'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

