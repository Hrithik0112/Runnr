/**
 * Download content as a file
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain') {
  try {
    // Create a blob with the content
    const blob = new Blob([content], { type: mimeType })
    
    // Create a temporary URL for the blob
    const url = URL.createObjectURL(blob)
    
    // Create a temporary anchor element
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    
    // Append to body, click, and remove
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Clean up the URL
    URL.revokeObjectURL(url)
    
    return true
  } catch (error) {
    console.error('Error downloading file:', error)
    return false
  }
}

/**
 * Download workflow as YAML file
 */
export function downloadWorkflowYAML(yamlContent: string, workflowName?: string) {
  // Generate filename from workflow name or use default
  const name = workflowName 
    ? workflowName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    : 'workflow'
  
  const filename = `${name}.yml`
  
  return downloadFile(yamlContent, filename, 'application/x-yaml')
}

