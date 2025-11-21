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

  return (
    <>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
              YAML Preview
            </h3>
            <div className="flex items-center space-x-3">
              {validationWarnings.length > 0 && (
                <span className="text-xs text-yellow-600 font-medium">
                  {validationWarnings.length} warning{validationWarnings.length !== 1 ? 's' : ''}
                </span>
              )}
              {validationErrors.length > 0 && (
                <span className="text-xs text-red-600 font-medium">
                  {validationErrors.length} error{validationErrors.length !== 1 ? 's' : ''}
                </span>
              )}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopy}
                  disabled={!yamlContent}
                  className="
                    px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md
                    hover:bg-gray-50 hover:border-gray-400
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-colors flex items-center space-x-1.5
                  "
                  title="Copy YAML to clipboard"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Copy</span>
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!yamlContent}
                  className="
                    px-3 py-1.5 text-xs font-medium text-white bg-blue-600 border border-blue-600 rounded-md
                    hover:bg-blue-700 hover:border-blue-700
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-colors flex items-center space-x-1.5
                  "
                  title="Download YAML file"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      {/* Validation Warnings */}
      {validationWarnings.length > 0 && (
        <div className="px-4 py-2 bg-yellow-50 border-b border-yellow-200">
          <div className="space-y-1">
            {validationWarnings.map((warning, index) => (
              <div key={`warning-${index}`} className="text-xs text-yellow-700 flex items-start">
                <svg className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{warning}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-200">
          <div className="space-y-1">
            {validationErrors.map((error, index) => (
              <div key={`error-${index}`} className="text-xs text-red-700 flex items-start">
                <svg className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            ))}
          </div>
        </div>
      )}

        {/* Editor */}
        <div className="flex-1 overflow-hidden">
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

