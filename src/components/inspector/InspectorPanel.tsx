import { useWorkflowStore } from '../../stores/workflowStore'
import JobInspector from './JobInspector'
import StepInspector from './StepInspector'
import StepEditor from './StepEditor'
import TriggerEditor from './TriggerEditor'
import WorkflowInspector from './WorkflowInspector'

export default function InspectorPanel() {
  const selectedNode = useWorkflowStore((state) => state.selectedNode)

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
          Properties
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {selectedNode.type === 'job' && selectedNode.jobId ? (
          <div>
            <JobInspector jobId={selectedNode.jobId} />
            <div className="border-t border-slate-200 mt-4">
              <StepEditor jobId={selectedNode.jobId} />
            </div>
          </div>
        ) : selectedNode.type === 'step' && selectedNode.jobId && selectedNode.stepId ? (
          <StepInspector jobId={selectedNode.jobId} stepId={selectedNode.stepId} />
        ) : selectedNode.type === 'trigger' ? (
          <TriggerEditor />
        ) : (
          <WorkflowInspector />
        )}
      </div>
    </div>
  )
}

