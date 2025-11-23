import { ReactNode, useState } from 'react'
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay } from '@dnd-kit/core'
import { useWorkflowStore } from '../../stores/workflowStore'
import TopBar from './TopBar'
import ComponentItem from '../sidebar/ComponentItem'

interface AppLayoutProps {
  sidebar: ReactNode
  canvas: ReactNode
  inspector: ReactNode
  yamlPreview?: ReactNode
}

export default function AppLayout({ sidebar, canvas, inspector, yamlPreview }: AppLayoutProps) {
  const addJob = useWorkflowStore((state) => state.addJob)
  const addStep = useWorkflowStore((state) => state.addStep)
  const workflow = useWorkflowStore((state) => state.workflow)
  const [showMobileInspector, setShowMobileInspector] = useState(false)
  const [showYAMLPreview, setShowYAMLPreview] = useState(true)
  const [rightPanelMode, setRightPanelMode] = useState<'inspector' | 'yaml' | 'split'>('inspector')
  const [activeId, setActiveId] = useState<string | null>(null)

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event

    if (!over) return

    // Handle step drops on jobs
    if (active.id === 'step' && typeof over.id === 'string' && over.id.startsWith('job-drop-')) {
      const jobId = over.id.replace('job-drop-', '')
      const job = workflow.jobs[jobId]
      if (job) {
        // Create a new step
        const stepId = `step_${Date.now()}`
        addStep(jobId, {
          id: stepId,
          name: 'New Step',
          run: 'echo "Hello World"'
        })
      }
      return
    }

    // Handle job drops on canvas
    if (active.id === 'job' && over.id === 'canvas-drop-zone') {
      const jobId = `job_${Date.now()}`
      addJob({
        id: jobId,
        name: 'New Job',
        'runs-on': 'ubuntu-latest',
        steps: [],
      })
      return
    }

    // Handle trigger clicks (already handled via onClick in ComponentItem)
    if (active.id === 'trigger') {
      // Triggers are handled via onClick, not drag
      return
    }
  }

  // Get component data for drag overlay
  const getDragOverlayContent = () => {
    if (!activeId) return null

    const components: Record<string, { name: string; description: string; icon: ReactNode }> = {
      job: {
        name: 'Job',
        description: 'A unit of work that runs on a runner',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        )
      },
      step: {
        name: 'Step',
        description: 'A single task within a job',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )
      },
      trigger: {
        name: 'Trigger',
        description: 'Event that starts the workflow',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
      }
    }

    const component = components[activeId]
    if (!component) return null

    return (
      <ComponentItem
        id={activeId}
        name={component.name}
        description={component.description}
        icon={component.icon}
      />
    )
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="w-full h-full flex flex-col bg-neutral-50">
        {/* Top Bar */}
        <TopBar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Sidebar */}
            <div className="w-full lg:w-64 bg-white border-r border-neutral-200 overflow-y-auto flex-shrink-0 shadow-soft">
              {sidebar}
            </div>

            {/* Canvas Area */}
            <div className="flex-1 overflow-hidden bg-neutral-50 min-w-0">
              {canvas}
            </div>

            {/* Right Panel - Desktop (Inspector and/or YAML Preview) */}
            <div className="hidden lg:flex w-96 bg-white border-l border-neutral-200 flex-shrink-0 flex-col shadow-soft">
              {/* Panel Tabs */}
              <div className="flex-shrink-0 border-b border-neutral-200 bg-neutral-50">
                <div className="flex">
                  <button
                    onClick={() => setRightPanelMode('inspector')}
                    className={`
                      flex-1 px-4 py-2.5 text-xs font-semibold transition-all duration-200
                      ${rightPanelMode === 'inspector' || rightPanelMode === 'split'
                        ? 'bg-white text-primary-600 border-b-2 border-primary-600'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                      }
                    `}
                  >
                    Properties
                  </button>
                  <button
                    onClick={() => setRightPanelMode('yaml')}
                    className={`
                      flex-1 px-4 py-2.5 text-xs font-semibold transition-all duration-200
                      ${rightPanelMode === 'yaml' || rightPanelMode === 'split'
                        ? 'bg-white text-primary-600 border-b-2 border-primary-600'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                      }
                    `}
                  >
                    YAML
                  </button>
                  <button
                    onClick={() => setRightPanelMode('split')}
                    className={`
                      px-3 py-2.5 text-xs font-semibold transition-all duration-200
                      ${rightPanelMode === 'split'
                        ? 'bg-white text-primary-600 border-b-2 border-primary-600'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                      }
                    `}
                    title="Split view"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Panel Content */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Inspector Panel */}
                {(rightPanelMode === 'inspector' || rightPanelMode === 'split') && (
                  <div className={`
                    ${rightPanelMode === 'split' ? 'h-1/2 border-b border-neutral-200' : 'flex-1'}
                    overflow-y-auto
                  `}>
                    {inspector}
                  </div>
                )}

                {/* YAML Preview Panel */}
                {(rightPanelMode === 'yaml' || rightPanelMode === 'split') && yamlPreview && (
                  <div className={`
                    ${rightPanelMode === 'split' ? 'h-1/2' : 'flex-1'}
                    overflow-hidden
                    ${rightPanelMode === 'yaml' ? 'border-t border-neutral-200' : ''}
                  `}>
                    {yamlPreview}
                  </div>
                )}
              </div>
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
            className="lg:hidden fixed bottom-4 right-4 p-3.5 bg-primary-600 text-white rounded-full shadow-large hover:bg-primary-700 transition-all duration-200 z-30"
            aria-label="Open inspector"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {/* YAML Preview Panel - Mobile (Bottom Sheet) */}
          {yamlPreview && showYAMLPreview && (
            <div className="lg:hidden fixed inset-x-0 bottom-0 h-3/4 bg-white border-t-2 border-gray-300 shadow-2xl z-50 flex flex-col">
              <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">YAML Preview</h3>
                <button
                  onClick={() => setShowYAMLPreview(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-md"
                  aria-label="Close YAML preview"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                {yamlPreview}
              </div>
            </div>
          )}

          {/* Mobile YAML Preview Toggle Button */}
          {yamlPreview && !showYAMLPreview && (
            <button
              onClick={() => setShowYAMLPreview(true)}
              className="lg:hidden fixed bottom-4 left-4 p-3.5 bg-success-600 text-white rounded-full shadow-large hover:bg-success-700 transition-all duration-200 z-30"
              aria-label="Open YAML preview"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* Drag Overlay - Shows dragged item above everything */}
      <DragOverlay
        style={{
          cursor: 'grabbing',
        }}
        className="z-[9999]"
      >
        {activeId && (
          <div 
            className="transform rotate-2 scale-105 shadow-2xl transition-transform duration-150"
            style={{
              filter: 'drop-shadow(0 10px 15px rgba(0, 0, 0, 0.2))',
            }}
          >
            {getDragOverlayContent()}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}

