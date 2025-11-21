import { useWorkflowStore } from './stores/workflowStore'

function App() {
  const workflow = useWorkflowStore((state) => state.workflow)
  const addJob = useWorkflowStore((state) => state.addJob)

  // Test function to verify store works
  const handleTestAddJob = () => {
    addJob({
      id: `job_${Date.now()}`,
      name: 'Test Job',
      'runs-on': 'ubuntu-latest',
      steps: []
    })
  }

  return (
    <div className="w-full h-full bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Runnr</h1>
        <p className="text-gray-600 mb-4">Visual CI/CD Pipeline Builder</p>
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">
            Workflow: {workflow.name}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            Jobs: {Object.keys(workflow.jobs).length}
          </p>
          <button
            onClick={handleTestAddJob}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test: Add Job
          </button>
        </div>
      </div>
    </div>
  )
}

export default App

