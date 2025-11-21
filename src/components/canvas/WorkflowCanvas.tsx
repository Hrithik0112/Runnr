import { useDroppable } from '@dnd-kit/core'
import { useWorkflowStore } from '../../stores/workflowStore'
import JobCard from './JobCard'

export default function WorkflowCanvas() {
  const { workflow, selectedNode, addJob, setSelectedNode } = useWorkflowStore()
  const jobs = Object.values(workflow.jobs)

  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-drop-zone',
  })

  const handleJobClick = (jobId: string) => {
    setSelectedNode({ type: 'job', jobId })
  }

  return (
    <div
      ref={setNodeRef}
      className={`
        w-full h-full p-8 overflow-auto
        ${isOver ? 'bg-blue-50' : 'bg-gray-50'}
        transition-colors duration-200
      `}
    >
      {jobs.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="mb-4">
              <svg
                className={`mx-auto h-16 w-16 ${isOver ? 'text-blue-400' : 'text-gray-400'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Workflow Canvas
            </h2>
            <p className="text-gray-500 mb-4">
              Drag components from the sidebar to start building your CI/CD pipeline
            </p>
            {isOver && (
              <div className="text-sm text-blue-600 font-medium">
                Drop here to add a job
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Jobs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onClick={() => handleJobClick(job.id)}
                isSelected={selectedNode.type === 'job' && selectedNode.jobId === job.id}
              />
            ))}
          </div>
          {isOver && (
            <div className="mt-4 p-4 border-2 border-dashed border-blue-400 rounded-lg bg-blue-50 text-center text-blue-600">
              Drop here to add a new job
            </div>
          )}
        </div>
      )}
    </div>
  )
}

