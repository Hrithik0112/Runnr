import { Step } from '../../types/workflow'

interface StepListProps {
  steps: Step[]
  jobId: string
  onStepClick: (stepId: string) => void
  selectedStepId?: string
}

export default function StepList({ steps, jobId, onStepClick, selectedStepId }: StepListProps) {
  if (steps.length === 0) {
    return null
  }

  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <div className="space-y-1">
        {steps.map((step, index) => {
          const isSelected = step.id === selectedStepId
          const stepName = step.name || step.uses || step.run || `Step ${index + 1}`
          
          return (
            <div
              key={step.id}
              onClick={(e) => {
                e.stopPropagation()
                onStepClick(step.id)
              }}
              className={`
                flex items-center space-x-2 px-2 py-1.5 rounded text-xs
                cursor-pointer transition-colors
                ${isSelected 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'hover:bg-gray-50 text-gray-600'
                }
              `}
            >
              <div className={`
                w-1.5 h-1.5 rounded-full
                ${isSelected ? 'bg-blue-500' : 'bg-gray-400'}
              `} />
              <span className="truncate flex-1">{stepName}</span>
              {step.uses && (
                <span className="text-gray-400">action</span>
              )}
              {step.run && (
                <span className="text-gray-400">run</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

