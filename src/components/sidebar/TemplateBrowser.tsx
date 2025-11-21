import { useState } from 'react'
import { templates, Template, getAllCategories } from '../../data/templates'
import { useWorkflowStore } from '../../stores/workflowStore'

export default function TemplateBrowser() {
  const setWorkflow = useWorkflowStore((state) => state.setWorkflow)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const categories = ['All', ...getAllCategories()]

  const filteredTemplates = selectedCategory === 'All'
    ? templates
    : templates.filter(t => t.category === selectedCategory)

  const handleTemplateSelect = (template: Template) => {
    // Create a deep copy of the template workflow
    const workflowCopy = JSON.parse(JSON.stringify(template.workflow))
    
    // Generate new IDs for jobs and steps to avoid conflicts
    const newJobs: Record<string, any> = {}
    Object.entries(workflowCopy.jobs).forEach(([jobId, job]: [string, any]) => {
      const newJobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const newSteps = job.steps.map((step: any) => ({
        ...step,
        id: `step_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }))
      
      newJobs[newJobId] = {
        ...job,
        id: newJobId,
        steps: newSteps
      }
    })
    
    workflowCopy.jobs = newJobs
    setWorkflow(workflowCopy)
  }

  return (
    <div className="p-4">
      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
        Templates
      </h2>

      {/* Category Filter */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-3 py-1 text-xs font-medium rounded-md transition-colors
                ${selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Templates List */}
      <div className="space-y-3">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-500">
            No templates found
          </div>
        ) : (
          filteredTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              className="
                p-3 bg-white rounded-lg border border-gray-200 
                cursor-pointer hover:border-blue-400 hover:shadow-md
                transition-all duration-200
              "
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  {template.name}
                </h3>
                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                  {template.category}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-2">
                {template.description}
              </p>
              <div className="flex items-center text-xs text-gray-400">
                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>{Object.keys(template.workflow.jobs).length} job{Object.keys(template.workflow.jobs).length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

