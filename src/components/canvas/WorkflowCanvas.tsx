import { useDroppable } from '@dnd-kit/core'
import { useWorkflowStore } from '../../stores/workflowStore'
import { useRef, useEffect, useState } from 'react'
import JobNode from './JobNode'
import ConnectionLine, { ConnectionLineDefs } from './ConnectionLine'

interface JobPosition {
  id: string
  x: number
  y: number
  width: number
  height: number
}

export default function WorkflowCanvas() {
  const { workflow, selectedNode, addJob, setSelectedNode } = useWorkflowStore()
  const jobs = Object.values(workflow.jobs)
  const jobRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const [jobPositions, setJobPositions] = useState<Map<string, JobPosition>>(new Map())
  const [connections, setConnections] = useState<Array<{ from: string; to: string }>>([])

  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-drop-zone',
  })

  const containerRef = useRef<HTMLDivElement>(null)

  // Update job positions when jobs change
  useEffect(() => {
    const updatePositions = () => {
      if (!containerRef.current) return

      const positions = new Map<string, JobPosition>()
      const newConnections: Array<{ from: string; to: string }> = []
      const containerRect = containerRef.current.getBoundingClientRect()

      jobRefs.current.forEach((element, jobId) => {
        if (element) {
          const rect = element.getBoundingClientRect()
          
          positions.set(jobId, {
            id: jobId,
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top + rect.height / 2,
            width: rect.width,
            height: rect.height,
          })
        }
      })

      // Calculate connections based on job dependencies
      jobs.forEach((job) => {
        if (job.needs && job.needs.length > 0) {
          job.needs.forEach((neededJobId) => {
            if (positions.has(neededJobId) && positions.has(job.id)) {
              newConnections.push({ from: neededJobId, to: job.id })
            }
          })
        }
      })

      setJobPositions(positions)
      setConnections(newConnections)
    }

    // Update positions after a short delay to ensure DOM is updated
    const timer = setTimeout(updatePositions, 100)
    window.addEventListener('resize', updatePositions)
    window.addEventListener('scroll', updatePositions, true)
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', updatePositions)
      window.removeEventListener('scroll', updatePositions, true)
    }
  }, [jobs, workflow.jobs])

  const handleJobClick = (jobId: string) => {
    setSelectedNode({ type: 'job', jobId })
  }

  const handleStepClick = (jobId: string, stepId: string) => {
    setSelectedNode({ type: 'step', jobId, stepId })
  }

  const setJobRef = (jobId: string, element: HTMLDivElement | null) => {
    if (element) {
      jobRefs.current.set(jobId, element)
    } else {
      jobRefs.current.delete(jobId)
    }
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
        <div ref={containerRef} className="space-y-4 relative p-4 sm:p-6 lg:p-8">
          <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-4">Jobs</h2>
          
          {/* SVG overlay for connections */}
          {connections.length > 0 && containerRef.current && (
            <svg
              className="absolute inset-0 pointer-events-none z-0"
              style={{ 
                width: containerRef.current.scrollWidth, 
                height: containerRef.current.scrollHeight 
              }}
            >
              <ConnectionLineDefs />
              {connections.map((connection, index) => {
                const fromPos = jobPositions.get(connection.from)
                const toPos = jobPositions.get(connection.to)
                
                if (!fromPos || !toPos) return null

                return (
                  <ConnectionLine
                    key={`${connection.from}-${connection.to}-${index}`}
                    from={{ x: fromPos.x, y: fromPos.y }}
                    to={{ x: toPos.x, y: toPos.y }}
                  />
                )
              })}
            </svg>
          )}

          {/* Job nodes */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                ref={(el) => setJobRef(job.id, el)}
              >
                <JobNode
                  job={job}
                  onClick={() => handleJobClick(job.id)}
                  onStepClick={(stepId) => handleStepClick(job.id, stepId)}
                  isSelected={selectedNode.type === 'job' && selectedNode.jobId === job.id}
                  selectedStepId={selectedNode.type === 'step' && selectedNode.jobId === job.id ? selectedNode.stepId : undefined}
                />
              </div>
            ))}
          </div>
          
          {isOver && (
            <div className="mt-4 p-4 border-2 border-dashed border-blue-400 rounded-lg bg-blue-50 text-center text-blue-600 relative z-10">
              Drop here to add a new job
            </div>
          )}
        </div>
      )}
    </div>
  )
}

