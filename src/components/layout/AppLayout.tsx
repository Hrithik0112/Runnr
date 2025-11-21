import { ReactNode } from 'react'
import { DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { useWorkflowStore } from '../../stores/workflowStore'

interface AppLayoutProps {
  sidebar: ReactNode
  canvas: ReactNode
  inspector: ReactNode
}

export default function AppLayout({ sidebar, canvas, inspector }: AppLayoutProps) {
  const addJob = useWorkflowStore((state) => state.addJob)

  const handleDragStart = (event: DragStartEvent) => {
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
        <div className="h-14 bg-white border-b border-gray-200 flex items-center px-4 shadow-sm">
          <h1 className="text-xl font-bold text-gray-900">Runnr</h1>
          <span className="ml-2 text-sm text-gray-500">Visual CI/CD Pipeline Builder</span>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
            {sidebar}
          </div>

          {/* Canvas Area */}
          <div className="flex-1 overflow-hidden bg-gray-50">
            {canvas}
          </div>

          {/* Inspector Panel */}
          <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
            {inspector}
          </div>
        </div>
      </div>
    </DndContext>
  )
}

