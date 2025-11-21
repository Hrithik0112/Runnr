import AppLayout from './components/layout/AppLayout'
import Sidebar from './components/sidebar/Sidebar'
import WorkflowCanvas from './components/canvas/WorkflowCanvas'
import InspectorPanel from './components/inspector/InspectorPanel'
import YAMLPreview from './components/yaml/YAMLPreview'

function App() {
  return (
    <AppLayout
      sidebar={<Sidebar />}
      canvas={<WorkflowCanvas />}
      inspector={<InspectorPanel />}
      yamlPreview={<YAMLPreview />}
    />
  )
}

export default App

