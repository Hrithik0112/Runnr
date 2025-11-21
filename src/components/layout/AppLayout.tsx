import { ReactNode, useState } from 'react'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { useWorkflowStore } from '../../stores/workflowStore'
import TopBar from './TopBar'

interface AppLayoutProps {
  sidebar: ReactNode
  canvas: ReactNode
  inspector: ReactNode
  yamlPreview?: ReactNode
}

export default function AppLayout({ sidebar, canvas, inspector, yamlPreview }: AppLayoutProps) {
  const addJob = useWorkflowStore((state) => state.addJob)
  const [showMobileInspector, setShowMobileInspector] = useState(false)

  const handleDragStart = () => {
    // Visual feedback handled by dnd-kit
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    // Only handle drops on the canvas
    if (!over || over.id !== 'canvas-drop-zone') {
      return
    }

    // Handle different component types
    if (active.id === 'job') {
      // Create a new job
      const jobId = `job_${Date.now()}`
      addJob({
        id: jobId,
        name: 'New Job',
        'runs-on': 'ubuntu-latest',
        steps: [],
      })
    } else if (active.id === 'step') {
      // Steps will be handled when dropping on a job (in future step)
      console.log('Step dropped - will be handled when dropping on a job')
    } else if (active.id === 'trigger') {
      // Triggers will be handled in the inspector (in future step)
      console.log('Trigger dropped - will be handled in inspector')
    }
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="w-full h-full flex flex-col bg-gray-50">
        {/* Top Bar */}
        <TopBar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Sidebar */}
            <div className="w-full lg:w-64 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
              {sidebar}
            </div>

            {/* Canvas Area */}
            <div className="flex-1 overflow-hidden bg-gray-50 min-w-0">
              {canvas}
            </div>

            {/* Inspector Panel - Desktop */}
            <div className="hidden lg:block w-80 bg-white border-l border-gray-200 overflow-y-auto flex-shrink-0">
              {inspector}
            </div>

            {/* Inspector Panel - Mobile Overlay */}
            {showMobileInspector && (
              <>
                <div
                  className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                  onClick={() => setShowMobileInspector(false)}
                  aria-label="Close inspector"
                />
                <div className="lg:hidden fixed right-0 top-14 bottom-0 w-80 bg-white border-l border-gray-200 overflow-y-auto z-50 animate-slide-in shadow-xl">
                  <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
                    <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Properties
                    </h2>
                    <button
                      onClick={() => setShowMobileInspector(false)}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded-md"
                      aria-label="Close inspector"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="p-4">
                    {inspector}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile Inspector Toggle Button */}
          <button
            onClick={() => setShowMobileInspector(true)}
            className="lg:hidden fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-30"
            aria-label="Open inspector"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {/* YAML Preview Panel */}
          {yamlPreview && (
            <div className="h-48 lg:h-64 border-t border-gray-200 bg-white flex-shrink-0">
              {yamlPreview}
            </div>
          )}
        </div>
      </div>
    </DndContext>
  )
}

