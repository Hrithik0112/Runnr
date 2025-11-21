import { dump } from 'js-yaml'
import { Workflow } from '../types/workflow'

/**
 * Removes undefined values and empty arrays/objects from the workflow object
 */
function cleanWorkflow(workflow: any): any {
  if (workflow === null || workflow === undefined) {
    return undefined
  }

  if (Array.isArray(workflow)) {
    const cleaned = workflow.map(cleanWorkflow).filter(item => item !== undefined)
    return cleaned.length > 0 ? cleaned : undefined
  }

  if (typeof workflow === 'object') {
    const cleaned: any = {}
    for (const [key, value] of Object.entries(workflow)) {
      const cleanedValue = cleanWorkflow(value)
      if (cleanedValue !== undefined) {
        cleaned[key] = cleanedValue
      }
    }
    return Object.keys(cleaned).length > 0 ? cleaned : undefined
  }

  return workflow
}

/**
 * Converts workflow JSON to GitHub Actions YAML format
 */
export function workflowToYAML(workflow: Workflow): string {
  // Create a clean copy of the workflow
  const cleaned = cleanWorkflow(workflow)

  // Ensure 'on' is always present (required by GitHub Actions)
  if (!cleaned.on || Object.keys(cleaned.on).length === 0) {
    cleaned.on = { workflow_dispatch: {} }
  }

  // Convert jobs object to proper format
  if (cleaned.jobs && Object.keys(cleaned.jobs).length > 0) {
    // Jobs are already in the correct format (object with job IDs as keys)
    // No transformation needed
  } else {
    // If no jobs, remove the jobs key
    delete cleaned.jobs
  }

  // Convert to YAML with proper formatting
  try {
    const yamlString = dump(cleaned, {
      indent: 2,
      lineWidth: -1, // No line wrapping
      noRefs: true,
      sortKeys: false, // Preserve key order
      quotingType: '"',
      forceQuotes: false,
    })

    return yamlString
  } catch (error) {
    console.error('Error converting workflow to YAML:', error)
    throw new Error('Failed to convert workflow to YAML')
  }
}

/**
 * Validates that the workflow has the minimum required structure
 */
export function validateWorkflow(workflow: Workflow): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Check for 'on' trigger
  if (!workflow.on || Object.keys(workflow.on).length === 0) {
    errors.push('Workflow must have at least one trigger (on)')
  }

  // Check for jobs
  if (!workflow.jobs || Object.keys(workflow.jobs).length === 0) {
    errors.push('Workflow must have at least one job')
  } else {
    // Validate each job
    Object.entries(workflow.jobs).forEach(([jobId, job]) => {
      if (!job['runs-on']) {
        errors.push(`Job "${jobId}" must specify a runner (runs-on)`)
      }
      if (!job.steps || job.steps.length === 0) {
        errors.push(`Job "${jobId}" must have at least one step`)
      } else {
        // Validate each step
        job.steps.forEach((step, index) => {
          if (!step.uses && !step.run) {
            errors.push(`Job "${jobId}", step ${index + 1} must have either "uses" or "run"`)
          }
        })
      }
    })
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

