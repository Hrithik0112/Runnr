import { Workflow, Job } from '../../types/workflow'

interface WorkflowVisualizationProps {
  workflow: Workflow
}

export default function WorkflowVisualization({ workflow }: WorkflowVisualizationProps) {
  const jobs = Object.values(workflow.jobs || {})

  const getTriggerDescription = () => {
    if (!workflow.on) return 'No trigger'
    
    const triggers: string[] = []
    const on = workflow.on as any
    
    if (on.push) {
      const branches = on.push.branches || []
      triggers.push(`Push to ${branches.length > 0 ? branches.join(', ') : 'any branch'}`)
    }
    if (on.pull_request) {
      triggers.push('Pull Request')
    }
    if (on.schedule) {
      triggers.push('Scheduled')
    }
    if (on.workflow_dispatch) {
      triggers.push('Manual')
    }

    return triggers.length > 0 ? triggers.join(', ') : 'Custom trigger'
  }

  return (
    <div className="space-y-4">
      {/* Workflow Info */}
      <div className="bg-white rounded-lg p-4 border border-slate-200">
        <h3 className="text-base font-semibold text-slate-900 mb-2">{workflow.name || 'Untitled Workflow'}</h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Trigger:</span>
            <span className="text-slate-700 font-medium">{getTriggerDescription()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Jobs:</span>
            <span className="text-slate-700 font-medium">{jobs.length}</span>
          </div>
        </div>
      </div>

      {/* Jobs */}
      {jobs.length > 0 ? (
        <div className="space-y-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} allJobs={jobs} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg p-6 border border-slate-200 text-center">
          <p className="text-sm text-slate-600">No jobs defined</p>
        </div>
      )}
    </div>
  )
}

interface JobCardProps {
  job: Job
  allJobs: Job[]
}

function JobCard({ job, allJobs }: JobCardProps) {
  const jobName = job.name || job.id
  const hasDependencies = job.needs && job.needs.length > 0

  return (
    <div className="bg-white rounded-lg p-4 border border-slate-200">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center">
          <svg className="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-slate-900 truncate">{jobName}</h4>
          <p className="text-xs text-slate-500 font-mono">{job.id}</p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-3">
        {/* Runner */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Runner:</span>
          <span className="text-slate-700 font-medium">{job['runs-on']}</span>
        </div>

        {/* Dependencies */}
        {hasDependencies && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Depends on:</span>
            <span className="text-slate-700 font-medium">
              {job.needs!.map(id => {
                const depJob = allJobs.find(j => j.id === id)
                return depJob?.name || id
              }).join(', ')}
            </span>
          </div>
        )}

        {/* Condition */}
        {job.if && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Condition:</span>
            <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-mono">{job.if}</code>
          </div>
        )}

        {/* Steps count */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Steps:</span>
          <span className="text-slate-700 font-medium">{job.steps.length}</span>
        </div>
      </div>

      {/* Steps List */}
      {job.steps.length > 0 && (
        <div className="border-t border-slate-200 pt-3">
          <div className="space-y-1.5">
            {job.steps.map((step, index) => (
              <div key={step.id || index} className="flex items-start gap-2 p-2 bg-slate-50 rounded">
                <div className="flex-shrink-0 w-5 h-5 rounded bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-700">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  {step.name && (
                    <p className="text-xs font-medium text-slate-900 mb-0.5">{step.name}</p>
                  )}
                  {step.uses && (
                    <code className="text-xs text-slate-600 font-mono bg-white px-1.5 py-0.5 rounded block">
                      {step.uses}
                    </code>
                  )}
                  {step.run && (
                    <code className="text-xs text-slate-600 font-mono bg-white px-1.5 py-0.5 rounded block mt-0.5">
                      {step.run.length > 50 ? `${step.run.substring(0, 50)}...` : step.run}
                    </code>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

