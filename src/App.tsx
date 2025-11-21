import AppLayout from './components/layout/AppLayout'
import Sidebar from './components/sidebar/Sidebar'
import WorkflowCanvas from './components/canvas/WorkflowCanvas'
import InspectorPanel from './components/inspector/InspectorPanel'

function App() {
  return (
    <AppLayout
      sidebar={<Sidebar />}
      canvas={<WorkflowCanvas />}
      inspector={<InspectorPanel />}
    />
  )
}

export default App

