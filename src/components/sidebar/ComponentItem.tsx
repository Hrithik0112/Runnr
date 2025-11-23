import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

interface ComponentItemProps {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  onClick?: () => void
}

export default function ComponentItem({ id, name, description, icon, onClick }: ComponentItemProps) {
  // If onClick is provided, don't make it draggable (e.g., trigger)
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable(
    onClick 
      ? { id: `no-drag-${id}`, data: {} }
      : {
          id,
          data: {
            type: id,
            name,
          },
        }
  )

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.3 : 1,
    transition: isDragging ? 'none' : 'opacity 0.2s ease',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(onClick ? {} : listeners)}
      {...attributes}
      onClick={onClick}
      className={`
        p-3 bg-white rounded-lg border-2 border-gray-200 
        ${onClick ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'}
        hover:border-blue-400 hover:shadow-md
        transition-all duration-200 ease-out
        ${isDragging ? 'shadow-lg border-blue-500 scale-95 opacity-30' : ''}
      `}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 text-gray-600">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{name}</p>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </div>
  )
}

