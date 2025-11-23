import { useWorkflowStore } from '../../stores/workflowStore'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearWorkflowFromStorage } from '../../utils/storage'
import ConfirmModal from '../../components/common/ConfirmModal'

export default function TopBar() {
  const navigate = useNavigate()
  const undo = useWorkflowStore((state) => state.undo)
  const redo = useWorkflowStore((state) => state.redo)
  const canUndo = useWorkflowStore((state) => state.canUndo)
  const canRedo = useWorkflowStore((state) => state.canRedo)
  const workflow = useWorkflowStore((state) => state.workflow)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [showClearModal, setShowClearModal] = useState(false)

  // Check if there's any data to clear
  const hasDataToClear = () => {
    const jobs = Object.keys(workflow.jobs || {})
    const hasJobs = jobs.length > 0
    const hasCustomName = workflow.name && workflow.name !== 'Untitled Workflow'
    const hasCustomTrigger = workflow.on && (
      JSON.stringify(workflow.on) !== JSON.stringify({
        push: { branches: ['main'] }
      })
    )
    
    return hasJobs || hasCustomName || hasCustomTrigger
  }

  const canClear = hasDataToClear()

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

  const handleClearData = () => {
    // Clear localStorage
    clearWorkflowFromStorage()
    
    // Reset workflow to empty state
    const emptyWorkflow = {
      name: 'Untitled Workflow',
      on: {
        push: {
          branches: ['main']
        }
      },
      jobs: {}
    }
    
    // Reset store completely - clear history and reset to empty workflow
    useWorkflowStore.setState({
      workflow: emptyWorkflow,
      history: [emptyWorkflow],
      historyIndex: 0,
      canUndo: false,
      canRedo: false,
      selectedNode: { type: null }
    })
    
    // Close modal
    setShowClearModal(false)
  }

  return (
    <>
      <ConfirmModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={handleClearData}
        title="Clear All Data"
        message="Are you sure you want to clear all workflow data? This action cannot be undone and will remove all jobs, steps, and configuration from local storage."
        confirmText="Clear Data"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
      
    <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shadow-sm">
      <div className="flex items-center min-w-0 flex-1 gap-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors duration-200 group"
          aria-label="Back to home"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-medium hidden sm:inline">Home</span>
        </button>
        <div className="h-6 w-px bg-slate-200"></div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-slate-900 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
            Runnr
          </h1>
        </div>
        <span className="hidden sm:inline ml-3 text-xs sm:text-sm text-slate-600 font-medium">Visual CI/CD Pipeline Builder</span>
        <span className="hidden md:flex ml-6 text-xs items-center">
          {saveStatus === 'saving' && (
            <span className="text-slate-600 flex items-center gap-1.5 font-medium">
              <svg className="w-3.5 h-3.5 animate-spin text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Saving...
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="text-emerald-600 flex items-center gap-1.5 font-medium">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Saved
            </span>
          )}
          {saveStatus === 'idle' && (
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
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
              ? 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400'
              : 'text-slate-400 bg-slate-50 border border-slate-200 cursor-not-allowed'
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
              ? 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400'
              : 'text-slate-400 bg-slate-50 border border-slate-200 cursor-not-allowed'
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

        <div className="h-6 w-px bg-slate-200 mx-1"></div>

        <button
          onClick={() => setShowClearModal(true)}
          disabled={!canClear}
          className={`
            px-3 py-1.5 text-sm font-semibold rounded-lg flex items-center gap-1.5 transition-all duration-200
            ${canClear
              ? 'text-red-600 bg-white border border-red-300 hover:bg-red-50 hover:border-red-400'
              : 'text-slate-400 bg-slate-50 border border-slate-200 cursor-not-allowed'
            }
          `}
          title={canClear ? "Clear all workflow data" : "No data to clear"}
          aria-label="Clear Data"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span className="hidden sm:inline">Clear</span>
        </button>
      </div>
    </div>
    </>
  )
}

