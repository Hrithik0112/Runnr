import { useWorkflowStore } from '../../stores/workflowStore'
import { useEffect, useState } from 'react'

export default function TopBar() {
  const undo = useWorkflowStore((state) => state.undo)
  const redo = useWorkflowStore((state) => state.redo)
  const canUndo = useWorkflowStore((state) => state.canUndo)
  const canRedo = useWorkflowStore((state) => state.canRedo)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+Z or Ctrl+Z for undo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        if (canUndo) {
          undo()
        }
      }
      // Cmd+Shift+Z or Ctrl+Shift+Z or Ctrl+Y for redo
      if (
        ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) ||
        ((e.metaKey || e.ctrlKey) && e.key === 'y')
      ) {
        e.preventDefault()
        if (canRedo) {
          redo()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, canUndo, canRedo])

  // Listen for save events
  useEffect(() => {
    const handleWorkflowSaved = () => {
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }

    // Show saving status when workflow changes (will be debounced)
    let previousWorkflow = useWorkflowStore.getState().workflow
    const unsubscribe = useWorkflowStore.subscribe((state) => {
      const currentWorkflow = state.workflow
      // Only update if workflow actually changed
      if (currentWorkflow !== previousWorkflow) {
        previousWorkflow = currentWorkflow
        setSaveStatus('saving')
      }
    })

    window.addEventListener('workflow-saved', handleWorkflowSaved)

    return () => {
      unsubscribe()
      window.removeEventListener('workflow-saved', handleWorkflowSaved)
    }
  }, [])

  return (
    <div className="h-14 bg-white border-b border-neutral-200 flex items-center justify-between px-4 sm:px-6 shadow-soft">
      <div className="flex items-center min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-medium">
            <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-black">
            Runnr
          </h1>
        </div>
        <span className="hidden sm:inline ml-3 text-xs sm:text-sm text-neutral-600 font-medium">Visual CI/CD Pipeline Builder</span>
        <span className="hidden md:flex ml-6 text-xs items-center">
          {saveStatus === 'saving' && (
            <span className="text-neutral-600 flex items-center gap-1.5 font-medium">
              <svg className="w-3.5 h-3.5 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Saving...
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="text-success-600 flex items-center gap-1.5 font-medium animate-fade-in">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Saved
            </span>
          )}
          {saveStatus === 'idle' && (
            <span className="text-neutral-400 flex items-center gap-1.5 font-medium">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Auto-saved
            </span>
          )}
        </span>
      </div>
      
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={undo}
          disabled={!canUndo}
          className={`
            px-3 py-1.5 text-sm font-semibold rounded-lg
            flex items-center gap-1.5
            transition-all duration-200
            ${canUndo
              ? 'text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400 hover:shadow-soft'
              : 'text-neutral-400 bg-neutral-50 border border-neutral-200 cursor-not-allowed'
            }
          `}
          title="Undo (Cmd+Z)"
          aria-label="Undo"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
          <span className="hidden sm:inline">Undo</span>
        </button>
        
        <button
          onClick={redo}
          disabled={!canRedo}
          className={`
            px-3 py-1.5 text-sm font-semibold rounded-lg
            flex items-center gap-1.5
            transition-all duration-200
            ${canRedo
              ? 'text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400 hover:shadow-soft'
              : 'text-neutral-400 bg-neutral-50 border border-neutral-200 cursor-not-allowed'
            }
          `}
          title="Redo (Cmd+Shift+Z)"
          aria-label="Redo"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
          </svg>
          <span className="hidden sm:inline">Redo</span>
        </button>
      </div>
    </div>
  )
}

