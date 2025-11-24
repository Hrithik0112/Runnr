import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { yamlToWorkflow } from '../../utils/yamlConverter'
import { Workflow } from '../../types/workflow'
import WorkflowVisualization from './WorkflowVisualization'

export default function YAMLViewer() {
  const navigate = useNavigate()
  const [yamlInput, setYamlInput] = useState('')
  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    if (!yamlInput.trim()) {
      setWorkflow(null)
      setError(null)
      setIsValid(false)
      return
    }

    const result = yamlToWorkflow(yamlInput)
    
    if (result.error) {
      setError(result.error)
      setWorkflow(null)
      setIsValid(false)
    } else if (result.workflow) {
      setWorkflow(result.workflow)
      setError(null)
      setIsValid(true)
    }
  }, [yamlInput])

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header - Matching TopBar style */}
      <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shadow-sm">
        <div className="flex items-center min-w-0 flex-1 gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors duration-200"
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
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Runnr</h1>
          </div>
          <span className="hidden sm:inline ml-3 text-xs sm:text-sm text-slate-600 font-medium">YAML Viewer</span>
          <span className="hidden md:flex ml-6 text-xs items-center">
            {isValid && (
              <span className="text-emerald-600 flex items-center gap-1.5 font-medium">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Valid
              </span>
            )}
            {error && (
              <span className="text-red-600 flex items-center gap-1.5 font-medium">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Error
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Two Pane Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane - YAML Input */}
        <div className="w-1/2 border-r border-slate-200 flex flex-col bg-white">
          <div className="px-4 py-2 border-b border-slate-200 bg-slate-50">
            <h2 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">YAML Input</h2>
          </div>
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="yaml"
              value={yamlInput}
              onChange={(value) => setYamlInput(value || '')}
              theme="vs-light"
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 13,
                lineNumbers: 'on',
                wordWrap: 'on',
                automaticLayout: true,
                tabSize: 2,
                renderWhitespace: 'boundary',
              }}
            />
          </div>
          {error && (
            <div className="px-4 py-2 bg-red-50 border-t border-red-200">
              <p className="text-xs text-red-700 font-medium">Parse Error:</p>
              <p className="text-xs text-red-600 mt-0.5">{error}</p>
            </div>
          )}
        </div>

        {/* Right Pane - Visual Representation */}
        <div className="w-1/2 flex flex-col bg-slate-50 overflow-auto">
          <div className="px-4 py-2 border-b border-slate-200 bg-white sticky top-0 z-10">
            <h2 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Visual</h2>
          </div>
          <div className="flex-1 p-4">
            {!yamlInput.trim() ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-slate-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm text-slate-600 font-medium mb-1">No YAML entered</p>
                  <p className="text-xs text-slate-500">Paste your workflow YAML to visualize</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md">
                  <svg className="mx-auto h-12 w-12 text-red-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-600 font-medium mb-1">Invalid YAML</p>
                  <p className="text-xs text-red-500">{error}</p>
                </div>
              </div>
            ) : workflow ? (
              <WorkflowVisualization workflow={workflow} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

