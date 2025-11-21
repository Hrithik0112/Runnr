import { Job } from '../../types/workflow'
import StepList from './StepList'

interface JobNodeProps {
  job: Job
  onClick: () => void
  onStepClick: (stepId: string) => void
  isSelected: boolean
  selectedStepId?: string
}

export default function JobNode({ job, onClick, onStepClick, isSelected, selectedStepId }: JobNodeProps) {
  const jobName = job.name || job.id
  const hasDependencies = job.needs && job.needs.length > 0
  const hasSteps = job.steps.length > 0

  return (
    <div
      onClick={onClick}
      className={`
        relative p-5 bg-white rounded-xl border-2 shadow-md cursor-pointer
        transition-all duration-200 transform
        ${isSelected 
          ? 'border-blue-500 shadow-lg ring-2 ring-blue-200 scale-105' 
          : 'border-gray-200 hover:border-blue-300 hover:shadow-lg hover:scale-102'
        }
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2 flex-1">
          <div className={`
            p-2 rounded-lg
            ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}
          `}>
            <svg 
              className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 truncate">
              {jobName}
            </h3>
          </div>
        </div>
        {isSelected && (
          <div className="ml-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="space-y-2">
        {/* Runner */}
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
          </svg>
          <span className="font-medium">{job['runs-on']}</span>
        </div>

        {/* Steps count */}
        {hasSteps && (
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span>{job.steps.length} step{job.steps.length !== 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Dependencies */}
        {hasDependencies && (
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span>Depends on {job.needs!.length} job{job.needs!.length !== 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Condition */}
        {job.if && (
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="truncate">Conditional</span>
          </div>
        )}
      </div>

      {/* Steps List */}
      <StepList
        steps={job.steps}
        jobId={job.id}
        onStepClick={onStepClick}
        selectedStepId={selectedStepId}
      />

      {/* Empty state indicator */}
      {!hasSteps && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-400 italic">No steps yet</p>
        </div>
      )}
    </div>
  )
}

