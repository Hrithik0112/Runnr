import { ErrorBoundary } from './components/common/ErrorBoundary'
import AppLayout from './components/layout/AppLayout'
import Sidebar from './components/sidebar/Sidebar'
import WorkflowCanvas from './components/canvas/WorkflowCanvas'
import InspectorPanel from './components/inspector/InspectorPanel'
import YAMLPreview from './components/yaml/YAMLPreview'

function App() {
  return (
    <ErrorBoundary>
      <AppLayout
        sidebar={<Sidebar />}
        canvas={<WorkflowCanvas />}
        inspector={<InspectorPanel />}
        yamlPreview={<YAMLPreview />}
      />
    </ErrorBoundary>
  )
}

export default App

