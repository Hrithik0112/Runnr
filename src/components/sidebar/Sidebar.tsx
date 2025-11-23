import { useState } from 'react'
import ComponentItem from './ComponentItem'
import TemplateBrowser from './TemplateBrowser'
import { useWorkflowStore } from '../../stores/workflowStore'

export default function Sidebar() {
  const setSelectedNode = useWorkflowStore((state) => state.setSelectedNode)
  const addStep = useWorkflowStore((state) => state.addStep)
  const workflow = useWorkflowStore((state) => state.workflow)
  const selectedNode = useWorkflowStore((state) => state.selectedNode)
  const [activeTab, setActiveTab] = useState<'components' | 'templates'>('components')

  const handleTriggerClick = () => {
    setSelectedNode({ type: 'trigger' })
  }

  const handleStepClick = () => {
    // If a job is selected, add step to that job
    if (selectedNode.type === 'job' && selectedNode.jobId) {
      const jobId = selectedNode.jobId
      const job = workflow.jobs[jobId]
      if (job) {
        const stepId = `step_${Date.now()}`
        addStep(jobId, {
          id: stepId,
          name: 'New Step',
          run: 'echo "Hello World"'
        })
        // Select the newly added step
        setSelectedNode({ type: 'step', jobId, stepId })
      }
    } else {
      // If no job is selected, show a message or select first job
      const jobs = Object.values(workflow.jobs)
      if (jobs.length > 0) {
        // Select the first job and add step to it
        const firstJob = jobs[0]
        const stepId = `step_${Date.now()}`
        addStep(firstJob.id, {
          id: stepId,
          name: 'New Step',
          run: 'echo "Hello World"'
        })
        setSelectedNode({ type: 'step', jobId: firstJob.id, stepId })
      }
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white">
        <button
          onClick={() => setActiveTab('components')}
          className={`
            flex-1 px-4 py-3 text-sm font-medium transition-colors
            ${activeTab === 'components'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }
          `}
        >
          Components
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`
            flex-1 px-4 py-3 text-sm font-medium transition-colors
            ${activeTab === 'templates'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }
          `}
        >
          Templates
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'components' ? (
          <div className="p-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
              Components
            </h2>
            <div className="space-y-3">
              <ComponentItem
                id="job"
                name="Job"
                description="A unit of work that runs on a runner"
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                }
              />
              <ComponentItem
                id="step"
                name="Step"
                description="A single task within a job"
                onClick={handleStepClick}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                }
              />
              <ComponentItem
                id="trigger"
                name="Trigger"
                description="Event that starts the workflow"
                onClick={handleTriggerClick}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                }
              />
            </div>
          </div>
        ) : (
          <TemplateBrowser />
        )}
      </div>
    </div>
  )
}

