import { useWorkflowStore } from '../../stores/workflowStore'
import { useMemo } from 'react'

interface JobInspectorProps {
  jobId: string
}

export default function JobInspector({ jobId }: JobInspectorProps) {
  const workflow = useWorkflowStore((state) => state.workflow)
  const updateJob = useWorkflowStore((state) => state.updateJob)
  
  const job = workflow.jobs[jobId]
  
  if (!job) {
    return (
      <div className="p-4 text-sm text-red-600">
        Job not found
      </div>
    )
  }

  // Get all other jobs for dependency selection
  const availableJobs = useMemo(() => {
    return Object.entries(workflow.jobs)
      .filter(([id]) => id !== jobId)
      .map(([id, j]) => ({ id, name: j.name || id }))
  }, [workflow.jobs, jobId])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateJob(jobId, { name: e.target.value })
  }

  const handleRunsOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateJob(jobId, { 'runs-on': e.target.value })
  }

  const handleNeedsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value)
    updateJob(jobId, { needs: selectedOptions.length > 0 ? selectedOptions : undefined })
  }

  const handleIfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    updateJob(jobId, { if: value || undefined })
  }

  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Properties</h3>
      </div>

      {/* Job Name */}
      <div>
        <label htmlFor="job-name" className="block text-sm font-medium text-gray-700 mb-2">
          Job Name
        </label>
        <input
          id="job-name"
          type="text"
          value={job.name || ''}
          onChange={handleNameChange}
          placeholder="Enter job name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Display name for this job
        </p>
      </div>

      {/* Runs On */}
      <div>
        <label htmlFor="runs-on" className="block text-sm font-medium text-gray-700 mb-2">
          Runner
        </label>
        <select
          id="runs-on"
          value={job['runs-on']}
          onChange={handleRunsOnChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="ubuntu-latest">Ubuntu Latest</option>
          <option value="ubuntu-22.04">Ubuntu 22.04</option>
          <option value="ubuntu-20.04">Ubuntu 20.04</option>
          <option value="windows-latest">Windows Latest</option>
          <option value="windows-2022">Windows 2022</option>
          <option value="macos-latest">macOS Latest</option>
          <option value="macos-13">macOS 13</option>
          <option value="macos-12">macOS 12</option>
        </select>
        <p className="mt-1 text-xs text-gray-500">
          The type of machine to run the job on
        </p>
      </div>

      {/* Dependencies (Needs) */}
      {availableJobs.length > 0 && (
        <div>
          <label htmlFor="needs" className="block text-sm font-medium text-gray-700 mb-2">
            Dependencies
          </label>
          <select
            id="needs"
            multiple
            value={job.needs || []}
            onChange={handleNeedsChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
            size={Math.min(availableJobs.length, 5)}
          >
            {availableJobs.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Hold Ctrl/Cmd to select multiple jobs. This job will wait for selected jobs to complete.
          </p>
        </div>
      )}

      {/* Conditional (If) */}
      <div>
        <label htmlFor="job-if" className="block text-sm font-medium text-gray-700 mb-2">
          Condition (if)
        </label>
        <input
          id="job-if"
          type="text"
          value={job.if || ''}
          onChange={handleIfChange}
          placeholder="github.ref == 'refs/heads/main'"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
        />
        <p className="mt-1 text-xs text-gray-500">
          Optional condition expression. Job runs only if condition is true.
        </p>
      </div>

      {/* Job Info */}
      <div className="pt-4 border-t border-gray-200">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Job ID:</span>
            <span className="font-mono text-gray-900">{job.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Steps:</span>
            <span className="text-gray-900">{job.steps.length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

