import { useWorkflowStore } from '../../stores/workflowStore'
import { useEffect } from 'react'

export default function TopBar() {
  const undo = useWorkflowStore((state) => state.undo)
  const redo = useWorkflowStore((state) => state.redo)
  const canUndo = useWorkflowStore((state) => state.canUndo)
  const canRedo = useWorkflowStore((state) => state.canRedo)

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

  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-gray-900">Runnr</h1>
        <span className="ml-2 text-sm text-gray-500">Visual CI/CD Pipeline Builder</span>
        <span className="ml-4 text-xs text-gray-400 flex items-center">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Auto-saved
        </span>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={undo}
          disabled={!canUndo}
          className={`
            px-3 py-1.5 text-sm font-medium rounded-md
            flex items-center space-x-1.5
            transition-colors
            ${canUndo
              ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              : 'text-gray-400 bg-gray-50 border border-gray-200 cursor-not-allowed'
            }
          `}
          title="Undo (Cmd+Z)"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
          <span>Undo</span>
        </button>
        
        <button
          onClick={redo}
          disabled={!canRedo}
          className={`
            px-3 py-1.5 text-sm font-medium rounded-md
            flex items-center space-x-1.5
            transition-colors
            ${canRedo
              ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              : 'text-gray-400 bg-gray-50 border border-gray-200 cursor-not-allowed'
            }
          `}
          title="Redo (Cmd+Shift+Z)"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
          </svg>
          <span>Redo</span>
        </button>
      </div>
    </div>
  )
}

