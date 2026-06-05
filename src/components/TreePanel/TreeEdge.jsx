import React, { memo } from 'react'
import { NODE_W, NODE_H } from '../../utils/treeLayout.js'
import { COLORS } from '../../constants/colors.js'

const TreeEdge = memo(function TreeEdge({ parentPos, childPos, isChosenPath, isPruned }) {
  const x1 = parentPos.x
  const y1 = parentPos.y + NODE_H
  const x2 = childPos.x
  const y2 = childPos.y

  const mx = x1
  const my = (y1 + y2) / 2

  const d = `M ${x1} ${y1} C ${mx} ${my}, ${x2} ${my}, ${x2} ${y2}`

  const color = isPruned
    ? COLORS.prunedText
    : isChosenPath
      ? COLORS.pathChosen
      : COLORS.border

  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={isChosenPath ? 2 : 1}
      strokeDasharray={isChosenPath ? 'none' : isPruned ? '4 4' : 'none'}
      opacity={isPruned ? 0.4 : 1}
      style={isChosenPath ? { animation: 'glowPulse 1.5s ease-in-out infinite' } : undefined}
    />
  )
})

export default TreeEdge
