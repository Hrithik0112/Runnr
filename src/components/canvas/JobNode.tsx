import { Job } from '../../types/workflow'
import StepList from './StepList'
import { useDroppable } from '@dnd-kit/core'

interface JobNodeProps {
  job: Job
  onClick: () => void
  onStepClick: (stepId: string) => void
  isSelected: boolean
  selectedStepId?: string
}

export default function JobNode({ job, onClick, onStepClick, isSelected, selectedStepId }: JobNodeProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `job-drop-${job.id}`,
  })
  const jobName = job.name || job.id
  const hasDependencies = job.needs && job.needs.length > 0
  const hasSteps = job.steps.length > 0

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      className={`
        relative p-5 bg-white rounded-xl border-2 shadow-md cursor-pointer
        transition-all duration-200 transform
        ${isSelected 
          ? 'border-slate-700 shadow-lg ring-2 ring-slate-200 scale-105' 
          : 'border-slate-200 hover:border-slate-400 hover:shadow-lg hover:scale-102'
        }
        ${isOver ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2 flex-1">
          <div className={`
            p-2 rounded-lg
            ${isSelected ? 'bg-slate-100' : 'bg-slate-100'}
          `}>
            <svg 
              className={`w-5 h-5 ${isSelected ? 'text-slate-700' : 'text-slate-600'}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-slate-900 truncate">
              {jobName}
            </h3>
          </div>
        </div>
        {isSelected && (
          <div className="ml-2">
            <div className="w-2 h-2 bg-slate-700 rounded-full"></div>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="space-y-2">
        {/* Runner */}
        <div className="flex items-center text-sm text-slate-600">
          <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
          </svg>
          <span className="font-medium">{job['runs-on']}</span>
        </div>

        {/* Steps count */}
        {hasSteps && (
          <div className="flex items-center text-sm text-slate-600">
            <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span>{job.steps.length} step{job.steps.length !== 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Dependencies */}
        {hasDependencies && (
          <div className="flex items-center text-sm text-slate-600">
            <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span>Depends on {job.needs!.length} job{job.needs!.length !== 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Condition */}
        {job.if && (
          <div className="flex items-center text-sm text-slate-600">
            <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <div className="mt-3 pt-3 border-t border-slate-100">
          <p className="text-xs text-slate-400 italic">
            {isOver ? 'Drop step here' : 'No steps yet'}
          </p>
        </div>
      )}
      
      {/* Drop indicator when dragging step over */}
      {isOver && (
        <div className="absolute inset-0 border-2 border-dashed border-emerald-500 rounded-xl bg-emerald-50 bg-opacity-50 flex items-center justify-center pointer-events-none z-10">
          <div className="text-sm font-medium text-emerald-700 bg-white px-3 py-1 rounded-md shadow-sm">
            Drop to add step
          </div>
        </div>
      )}
    </div>
  )
}

