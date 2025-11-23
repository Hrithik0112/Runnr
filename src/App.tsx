import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import AppLayout from './components/layout/AppLayout'
import Sidebar from './components/sidebar/Sidebar'
import WorkflowCanvas from './components/canvas/WorkflowCanvas'
import InspectorPanel from './components/inspector/InspectorPanel'
import YAMLPreview from './components/yaml/YAMLPreview'
import LandingPage from './components/landing/LandingPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/builder"
          element={
            <ErrorBoundary>
              <AppLayout
                sidebar={<Sidebar />}
                canvas={<WorkflowCanvas />}
                inspector={<InspectorPanel />}
                yamlPreview={<YAMLPreview />}
              />
            </ErrorBoundary>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

