import ComponentItem from './ComponentItem'

export default function Sidebar() {
  return (
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
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        />
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
          Templates
        </h2>
        <div className="text-xs text-gray-500">
          Templates coming soon
        </div>
      </div>
    </div>
  )
}

