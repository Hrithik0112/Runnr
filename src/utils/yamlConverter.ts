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

export interface ValidationIssue {
  type: 'error' | 'warning'
  message: string
  jobId?: string
  stepIndex?: number
}

/**
 * Validates that the workflow has the minimum required structure
 */
export function validateWorkflow(workflow: Workflow): { 
  valid: boolean
  errors: string[]
  warnings: string[]
  issues: ValidationIssue[]
} {
  const errors: string[] = []
  const warnings: string[] = []
  const issues: ValidationIssue[] = []
  const jobIds = workflow.jobs ? Object.keys(workflow.jobs) : []

  // Check for 'on' trigger
  if (!workflow.on || Object.keys(workflow.on).length === 0) {
    const msg = 'Workflow must have at least one trigger (on)'
    errors.push(msg)
    issues.push({ type: 'error', message: msg })
  }

  // Check for jobs
  if (!workflow.jobs || Object.keys(workflow.jobs).length === 0) {
    const msg = 'Workflow must have at least one job'
    errors.push(msg)
    issues.push({ type: 'error', message: msg })
  } else {
    // Validate each job
    Object.entries(workflow.jobs).forEach(([jobId, job]) => {
      // Check runs-on
      if (!job['runs-on']) {
        const msg = `Job "${jobId}" must specify a runner (runs-on)`
        errors.push(msg)
        issues.push({ type: 'error', message: msg, jobId })
      }

      // Check job name
      if (!job.name || job.name.trim() === '') {
        const msg = `Job "${jobId}" should have a descriptive name`
        warnings.push(msg)
        issues.push({ type: 'warning', message: msg, jobId })
      }

      // Check dependencies
      if (job.needs && job.needs.length > 0) {
        job.needs.forEach((neededJobId) => {
          if (!jobIds.includes(neededJobId)) {
            const msg = `Job "${jobId}" depends on "${neededJobId}" which does not exist`
            errors.push(msg)
            issues.push({ type: 'error', message: msg, jobId })
          }
        })
      }

      // Check for circular dependencies (basic check)
      if (job.needs && job.needs.includes(jobId)) {
        const msg = `Job "${jobId}" cannot depend on itself`
        errors.push(msg)
        issues.push({ type: 'error', message: msg, jobId })
      }

      // Check steps
      if (!job.steps || job.steps.length === 0) {
        const msg = `Job "${jobId}" must have at least one step`
        errors.push(msg)
        issues.push({ type: 'error', message: msg, jobId })
      } else {
        // Validate each step
        job.steps.forEach((step, index) => {
          // Check if step has uses or run
          if (!step.uses && !step.run) {
            const msg = `Job "${jobId}", step ${index + 1} must have either "uses" or "run"`
            errors.push(msg)
            issues.push({ type: 'error', message: msg, jobId, stepIndex: index })
          }

          // Check if step has both uses and run (shouldn't happen, but warn)
          if (step.uses && step.run) {
            const msg = `Job "${jobId}", step ${index + 1} has both "uses" and "run" - only one should be used`
            warnings.push(msg)
            issues.push({ type: 'warning', message: msg, jobId, stepIndex: index })
          }

          // Check for checkout step (best practice)
          if (index === 0 && !step.uses?.includes('checkout')) {
            const msg = `Job "${jobId}" should start with a checkout step`
            warnings.push(msg)
            issues.push({ type: 'warning', message: msg, jobId })
          }

          // Check step name
          if (!step.name && step.run) {
            const msg = `Job "${jobId}", step ${index + 1} should have a descriptive name`
            warnings.push(msg)
            issues.push({ type: 'warning', message: msg, jobId, stepIndex: index })
          }

          // Check action version (best practice)
          if (step.uses && !step.uses.includes('@')) {
            const msg = `Job "${jobId}", step ${index + 1} action "${step.uses}" should specify a version (e.g., @v1)`
            warnings.push(msg)
            issues.push({ type: 'warning', message: msg, jobId, stepIndex: index })
          }
        })
      }
    })
  }

  // Check for workflow name
  if (!workflow.name || workflow.name.trim() === '') {
    const msg = 'Workflow should have a descriptive name'
    warnings.push(msg)
    issues.push({ type: 'warning', message: msg })
  }

  // Check for duplicate job IDs (shouldn't happen, but validate)
  const duplicateJobIds = jobIds.filter((id, index) => jobIds.indexOf(id) !== index)
  if (duplicateJobIds.length > 0) {
    const msg = `Duplicate job IDs found: ${duplicateJobIds.join(', ')}`
    errors.push(msg)
    issues.push({ type: 'error', message: msg })
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    issues,
  }
}

