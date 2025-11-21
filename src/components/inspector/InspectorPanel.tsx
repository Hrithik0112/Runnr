import { useWorkflowStore } from '../../stores/workflowStore'
import JobInspector from './JobInspector'
import StepInspector from './StepInspector'
import StepEditor from './StepEditor'

export default function InspectorPanel() {
  const selectedNode = useWorkflowStore((state) => state.selectedNode)

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
          Properties
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {selectedNode.type === 'job' && selectedNode.jobId ? (
          <div>
            <JobInspector jobId={selectedNode.jobId} />
            <div className="border-t border-gray-200 mt-4">
              <StepEditor jobId={selectedNode.jobId} />
            </div>
          </div>
        ) : selectedNode.type === 'step' && selectedNode.jobId && selectedNode.stepId ? (
          <StepInspector jobId={selectedNode.jobId} stepId={selectedNode.stepId} />
        ) : selectedNode.type === 'trigger' ? (
          <div className="p-4 text-center py-8">
            <p className="text-sm text-gray-500">Trigger editor coming soon</p>
          </div>
        ) : (
          <div className="p-4 text-center py-8">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-500">
              Select a component to edit its properties
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

