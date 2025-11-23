import { useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'
import { useWorkflowStore } from '../../stores/workflowStore'
import { workflowToYAML, validateWorkflow } from '../../utils/yamlConverter'
import { copyToClipboard } from '../../utils/clipboard'
import { downloadWorkflowYAML } from '../../utils/export'
import Toast from '../common/Toast'

export default function YAMLPreview() {
  const workflow = useWorkflowStore((state) => state.workflow)
  const [yamlContent, setYamlContent] = useState('')
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [validationWarnings, setValidationWarnings] = useState<string[]>([])
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    try {
      // Check if workflow is empty (no jobs)
      const isEmpty = !workflow.jobs || Object.keys(workflow.jobs).length === 0
      
      if (isEmpty) {
        // Don't show errors for empty workflow - it's expected when starting
        setValidationErrors([])
        setValidationWarnings([])
        setYamlContent('# Your workflow YAML will appear here\n# Start by adding jobs from the sidebar')
        return
      }

      const validation = validateWorkflow(workflow)
      setValidationErrors(validation.errors)
      setValidationWarnings(validation.warnings)

      if (validation.valid) {
        const yaml = workflowToYAML(workflow)
        setYamlContent(yaml)
      } else {
        // Still generate YAML even if there are validation errors
        // so user can see what's being generated
        try {
          const yaml = workflowToYAML(workflow)
          setYamlContent(yaml)
        } catch (error) {
          setYamlContent('# Error generating YAML\n# Please check the workflow configuration')
        }
      }
    } catch (error) {
      console.error('Error generating YAML:', error)
      setYamlContent('# Error generating YAML\n# Please check the workflow configuration')
      setValidationErrors(['Failed to generate YAML'])
      setValidationWarnings([])
    }
  }, [workflow])

  const handleCopy = async () => {
    if (!yamlContent) {
      setToast({ message: 'No YAML content to copy', type: 'error' })
      return
    }

    const success = await copyToClipboard(yamlContent)
    if (success) {
      setToast({ message: 'YAML copied to clipboard!', type: 'success' })
    } else {
      setToast({ message: 'Failed to copy to clipboard', type: 'error' })
    }
  }

  const handleDownload = () => {
    if (!yamlContent) {
      setToast({ message: 'No YAML content to download', type: 'error' })
      return
    }

    const success = downloadWorkflowYAML(yamlContent, workflow.name)
    if (success) {
      setToast({ message: 'YAML file downloaded!', type: 'success' })
    } else {
      setToast({ message: 'Failed to download file', type: 'error' })
    }
  }

  const isEmpty = !yamlContent || yamlContent.startsWith('# Your workflow YAML')
  const hasErrors = validationErrors.length > 0
  const hasWarnings = validationWarnings.length > 0
  const isValid = !hasErrors && !isEmpty

  return (
    <>
      <div className="h-full flex flex-col bg-white">
        {/* Header */}
        <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex flex-col gap-2">
            {/* Row 1: Title and Status Badges */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                YAML Preview
              </h3>
              {isValid && !hasWarnings && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Valid
                </span>
              )}
              {hasWarnings && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="whitespace-nowrap">{validationWarnings.length} warning{validationWarnings.length !== 1 ? 's' : ''}</span>
                </span>
              )}
              {hasErrors && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="whitespace-nowrap">{validationErrors.length} error{validationErrors.length !== 1 ? 's' : ''}</span>
                </span>
              )}
            </div>
            
            {/* Row 2: Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                disabled={isEmpty}
                className="
                  px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md
                  hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300
                  transition-all duration-150 flex items-center gap-1.5 shadow-sm
                  active:scale-[0.98]
                "
                title="Copy YAML to clipboard"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy</span>
              </button>
              <button
                onClick={handleDownload}
                disabled={isEmpty}
                className="
                  px-3 py-1.5 text-xs font-medium text-white bg-blue-600 border border-blue-600 rounded-md
                  hover:bg-blue-700 hover:border-blue-700 hover:shadow-md
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-600 disabled:hover:border-blue-600
                  transition-all duration-150 flex items-center gap-1.5 shadow-sm
                  active:scale-[0.98]
                "
                title="Download YAML file"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>

        {/* Validation Messages - Collapsible */}
        {(hasErrors || hasWarnings) && (
          <div className="flex-shrink-0 border-b border-gray-200">
            {hasErrors && (
              <div className="px-4 py-2.5 bg-red-50 border-b border-red-100">
                <details className="group">
                  <summary className="cursor-pointer flex items-center justify-between text-xs font-medium text-red-800 hover:text-red-900">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {validationErrors.length} error{validationErrors.length !== 1 ? 's' : ''} found
                    </span>
                    <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="mt-2 space-y-1.5 pl-6">
                    {validationErrors.map((error, index) => (
                      <div key={`error-${index}`} className="text-xs text-red-700">
                        • {error}
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            )}
            {hasWarnings && (
              <div className="px-4 py-2.5 bg-yellow-50">
                <details className="group">
                  <summary className="cursor-pointer flex items-center justify-between text-xs font-medium text-yellow-800 hover:text-yellow-900">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {validationWarnings.length} warning{validationWarnings.length !== 1 ? 's' : ''}
                    </span>
                    <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="mt-2 space-y-1.5 pl-6">
                    {validationWarnings.map((warning, index) => (
                      <div key={`warning-${index}`} className="text-xs text-yellow-700">
                        • {warning}
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            )}
          </div>
        )}

        {/* Editor */}
        <div className="flex-1 overflow-hidden relative">
          {isEmpty ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center px-4">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm font-medium text-gray-700 mb-1">No workflow yet</p>
                <p className="text-xs text-gray-500">Add jobs to see your YAML here</p>
              </div>
            </div>
          ) : (
            <Editor
              height="100%"
              defaultLanguage="yaml"
              value={yamlContent}
              theme="vs-light"
              options={{
                readOnly: true,
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
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  )
}

