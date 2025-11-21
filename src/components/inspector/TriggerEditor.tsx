import { useWorkflowStore } from '../../stores/workflowStore'
import { TriggerConfig } from '../../types/workflow'
import { useState } from 'react'

export default function TriggerEditor() {
  const workflow = useWorkflowStore((state) => state.workflow)
  const updateTrigger = useWorkflowStore((state) => state.updateTrigger)

  const [enabledTriggers, setEnabledTriggers] = useState<Set<string>>(() => {
    const enabled = new Set<string>()
    if (workflow.on.push) enabled.add('push')
    if (workflow.on.pull_request) enabled.add('pull_request')
    if (workflow.on.schedule) enabled.add('schedule')
    if (workflow.on.workflow_dispatch) enabled.add('workflow_dispatch')
    return enabled
  })

  const updateTriggerConfig = (updates: Partial<TriggerConfig>) => {
    const newTrigger: TriggerConfig = {
      ...workflow.on,
      ...updates
    }
    updateTrigger(newTrigger)
  }

  const toggleTrigger = (triggerType: string, enabled: boolean) => {
    const newEnabled = new Set(enabledTriggers)
    if (enabled) {
      newEnabled.add(triggerType)
    } else {
      newEnabled.delete(triggerType)
    }
    setEnabledTriggers(newEnabled)

    const updates: Partial<TriggerConfig> = {}
    if (triggerType === 'push') {
      updates.push = enabled ? { branches: ['main'] } : undefined
    } else if (triggerType === 'pull_request') {
      updates.pull_request = enabled ? {} : undefined
    } else if (triggerType === 'schedule') {
      updates.schedule = enabled ? [{ cron: '0 0 * * *' }] : undefined
    } else if (triggerType === 'workflow_dispatch') {
      updates.workflow_dispatch = enabled ? {} : undefined
    }
    updateTriggerConfig(updates)
  }

  const updatePushBranches = (branches: string[]) => {
    updateTriggerConfig({
      push: {
        ...workflow.on.push,
        branches: branches.length > 0 ? branches : undefined
      }
    })
  }

  const updatePullRequestBranches = (branches: string[]) => {
    updateTriggerConfig({
      pull_request: {
        ...workflow.on.pull_request,
        branches: branches.length > 0 ? branches : undefined
      }
    })
  }

  const updateSchedule = (cron: string, index: number) => {
    const schedules = workflow.on.schedule || []
    const updated = [...schedules]
    updated[index] = { cron }
    updateTriggerConfig({ schedule: updated })
  }

  const addSchedule = () => {
    const schedules = workflow.on.schedule || []
    updateTriggerConfig({ schedule: [...schedules, { cron: '0 0 * * *' }] })
  }

  const removeSchedule = (index: number) => {
    const schedules = workflow.on.schedule || []
    const updated = schedules.filter((_, i) => i !== index)
    updateTriggerConfig({ schedule: updated.length > 0 ? updated : undefined })
  }

  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow Triggers</h3>
        <p className="text-sm text-gray-500 mb-4">
          Configure when this workflow should run
        </p>
      </div>

      {/* Push Trigger */}
      <div className="border border-gray-200 rounded-lg p-4">
        <label className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={enabledTriggers.has('push')}
              onChange={(e) => toggleTrigger('push', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Push</span>
          </div>
        </label>
        {enabledTriggers.has('push') && (
          <div className="mt-3 space-y-3 pl-6">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Branches
              </label>
              <input
                type="text"
                value={workflow.on.push?.branches?.join(', ') || ''}
                onChange={(e) => {
                  const branches = e.target.value.split(',').map(b => b.trim()).filter(Boolean)
                  updatePushBranches(branches)
                }}
                placeholder="main, develop"
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-400">Comma-separated branch names</p>
            </div>
          </div>
        )}
      </div>

      {/* Pull Request Trigger */}
      <div className="border border-gray-200 rounded-lg p-4">
        <label className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={enabledTriggers.has('pull_request')}
              onChange={(e) => toggleTrigger('pull_request', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Pull Request</span>
          </div>
        </label>
        {enabledTriggers.has('pull_request') && (
          <div className="mt-3 space-y-3 pl-6">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Branches
              </label>
              <input
                type="text"
                value={workflow.on.pull_request?.branches?.join(', ') || ''}
                onChange={(e) => {
                  const branches = e.target.value.split(',').map(b => b.trim()).filter(Boolean)
                  updatePullRequestBranches(branches)
                }}
                placeholder="main, develop"
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-400">Comma-separated branch names (optional)</p>
            </div>
          </div>
        )}
      </div>

      {/* Schedule Trigger */}
      <div className="border border-gray-200 rounded-lg p-4">
        <label className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={enabledTriggers.has('schedule')}
              onChange={(e) => toggleTrigger('schedule', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Schedule (Cron)</span>
          </div>
        </label>
        {enabledTriggers.has('schedule') && (
          <div className="mt-3 space-y-3 pl-6">
            {(workflow.on.schedule || []).map((schedule, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={schedule.cron}
                  onChange={(e) => updateSchedule(e.target.value, index)}
                  placeholder="0 0 * * *"
                  className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
                {(workflow.on.schedule || []).length > 1 && (
                  <button
                    onClick={() => removeSchedule(index)}
                    className="px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addSchedule}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              + Add Schedule
            </button>
            <p className="text-xs text-gray-400">
              Cron format: minute hour day month weekday (e.g., "0 0 * * *" = daily at midnight)
            </p>
          </div>
        )}
      </div>

      {/* Workflow Dispatch Trigger */}
      <div className="border border-gray-200 rounded-lg p-4">
        <label className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={enabledTriggers.has('workflow_dispatch')}
              onChange={(e) => toggleTrigger('workflow_dispatch', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Manual Trigger</span>
          </div>
        </label>
        {enabledTriggers.has('workflow_dispatch') && (
          <div className="mt-3 pl-6">
            <p className="text-xs text-gray-500">
              Allows manual triggering of the workflow from GitHub Actions UI
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

