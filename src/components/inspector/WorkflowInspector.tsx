import { useWorkflowStore } from '../../stores/workflowStore'
import { useState } from 'react'

export default function WorkflowInspector() {
  const workflow = useWorkflowStore((state) => state.workflow)
  const updateWorkflowName = useWorkflowStore((state) => state.updateWorkflowName)
  const setSelectedNode = useWorkflowStore((state) => state.setSelectedNode)

  const [workflowName, setWorkflowName] = useState(workflow.name)

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setWorkflowName(newName)
    updateWorkflowName(newName)
  }

  const handleEditTriggers = () => {
    setSelectedNode({ type: 'trigger' })
  }

  return (
    <div className="p-4 space-y-6">
      {/* Workflow Name */}
      <div>
        <label htmlFor="workflow-name" className="block text-sm font-medium text-slate-700 mb-1.5">
          Workflow Name
        </label>
        <input
          id="workflow-name"
          type="text"
          value={workflowName}
          onChange={handleNameChange}
          placeholder="Enter workflow name"
          className="
            w-full px-3 py-2 border border-slate-300 rounded-md
            text-sm text-slate-900
            focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-slate-700
            transition-colors
          "
        />
        <p className="mt-1.5 text-xs text-slate-500">
          This name will appear in the generated YAML file
        </p>
      </div>

      {/* Quick Actions */}
      <div className="pt-4 border-t border-slate-200">
        <h3 className="text-sm font-medium text-slate-700 mb-3">Quick Actions</h3>
        <button
          onClick={handleEditTriggers}
          className="
            w-full px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md
            hover:bg-slate-50 hover:border-slate-400
            transition-colors flex items-center justify-between
          "
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Edit Triggers
          </span>
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}

