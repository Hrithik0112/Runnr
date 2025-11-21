import { Workflow } from '../types/workflow'

const STORAGE_KEY = 'runnr-workflow'

/**
 * Save workflow to localStorage
 */
export function saveWorkflowToStorage(workflow: Workflow): boolean {
  try {
    const serialized = JSON.stringify(workflow)
    localStorage.setItem(STORAGE_KEY, serialized)
    return true
  } catch (error) {
    console.error('Error saving workflow to localStorage:', error)
    return false
  }
}

/**
 * Load workflow from localStorage
 */
export function loadWorkflowFromStorage(): Workflow | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY)
    if (!serialized) {
      return null
    }
    return JSON.parse(serialized) as Workflow
  } catch (error) {
    console.error('Error loading workflow from localStorage:', error)
    return null
  }
}

/**
 * Clear workflow from localStorage
 */
export function clearWorkflowFromStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Error clearing workflow from localStorage:', error)
  }
}

/**
 * Check if workflow exists in localStorage
 */
export function hasWorkflowInStorage(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null
}

