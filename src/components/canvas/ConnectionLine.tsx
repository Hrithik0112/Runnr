interface ConnectionLineProps {
  from: { x: number; y: number }
  to: { x: number; y: number }
}

export default function ConnectionLine({ from, to }: ConnectionLineProps) {
  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke="#3b82f6"
      strokeWidth="2"
      strokeDasharray="4,4"
      markerEnd="url(#arrowhead-connection)"
    />
  )
}

// Arrow marker definition component (should be rendered once per SVG)
export function ConnectionLineDefs() {
  return (
    <defs>
      <marker
        id="arrowhead-connection"
        markerWidth="10"
        markerHeight="10"
        refX="9"
        refY="3"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <polygon
          points="0 0, 10 3, 0 6"
          fill="#3b82f6"
        />
      </marker>
    </defs>
  )
}

