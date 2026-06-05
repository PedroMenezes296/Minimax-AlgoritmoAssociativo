import React, { memo } from 'react'
import { NODE_W, NODE_H } from '../../utils/treeLayout.js'
import { COLORS, getNodeColor } from '../../constants/colors.js'

const MINI_CELL = NODE_W / 3 - 1
const MINI_OFFSET_X = 4
const MINI_OFFSET_Y = 14
const MINI_GAP = 1

function MiniBoard({ board, color }) {
  return (
    <>
      {board.map((cell, i) => {
        const col = i % 3
        const row = Math.floor(i / 3)
        const x = MINI_OFFSET_X + col * (MINI_CELL + MINI_GAP)
        const y = MINI_OFFSET_Y + row * (MINI_CELL + MINI_GAP)
        const symbol = cell === 1 ? 'O' : cell === -1 ? 'X' : ''
        const symColor = cell === 1 ? COLORS.winAi : cell === -1 ? COLORS.winHuman : 'transparent'
        return (
          <g key={i}>
            <rect
              x={x} y={y}
              width={MINI_CELL} height={MINI_CELL}
              fill={COLORS.bgPrimary}
              stroke={COLORS.border}
              strokeWidth={0.5}
              rx={1}
            />
            {symbol && (
              <text
                x={x + MINI_CELL / 2}
                y={y + MINI_CELL / 2 + 4}
                textAnchor="middle"
                fontSize={MINI_CELL * 0.65}
                fill={symColor}
                fontFamily="Space Mono, monospace"
                fontWeight="700"
              >
                {symbol}
              </text>
            )}
          </g>
        )
      })}
    </>
  )
}

const TreeNode = memo(function TreeNode({ node, pos, animatedUpTo }) {
  if (node.id > animatedUpTo) return null

  const { x, y } = pos
  const color = getNodeColor(node)
  const halfW = NODE_W / 2

  const borderColor = node.isChosenPath ? COLORS.pathChosen : color
  const borderWidth = node.isChosenPath ? 2 : 1
  const opacity = node.isPruned ? 0.45 : 1

  const valStr = node.value === null ? '?' : node.value > 0 ? `+${node.value}` : `${node.value}`
  const badge = node.isPruned ? '✂' : node.type

  return (
    <g
      transform={`translate(${x - halfW}, ${y})`}
      opacity={opacity}
      style={{ animation: 'fadeScaleIn 0.2s ease-out' }}
    >
      {/* Card background */}
      <rect
        x={0} y={0}
        width={NODE_W} height={NODE_H}
        rx={5}
        fill={COLORS.bgCard}
        stroke={borderColor}
        strokeWidth={borderWidth}
        style={node.isChosenPath ? { animation: 'glowPulse 1.5s ease-in-out infinite' } : undefined}
        filter={node.isChosenPath ? `drop-shadow(0 0 6px ${borderColor})` : node.isPruned ? 'none' : `drop-shadow(0 0 3px ${color}88)`}
      />

      {/* Mini board */}
      <MiniBoard board={node.board} color={color} />

      {/* Value */}
      <text
        x={NODE_W / 2}
        y={NODE_H - 16}
        textAnchor="middle"
        fontSize={13}
        fontWeight="700"
        fontFamily="Space Mono, monospace"
        fill={node.isPruned ? COLORS.prunedText : color}
        style={{ textShadow: node.isPruned ? 'none' : `0 0 6px ${color}` }}
      >
        {valStr}
      </text>

      {/* MAX/MIN/✂ badge */}
      <text
        x={NODE_W - 4}
        y={11}
        textAnchor="end"
        fontSize={8}
        fontFamily="IBM Plex Mono, monospace"
        fill={node.isPruned ? COLORS.prunedText : color}
        letterSpacing="0.05em"
      >
        {badge}
      </text>

      {/* Depth indicator */}
      <text
        x={4}
        y={11}
        textAnchor="start"
        fontSize={8}
        fontFamily="IBM Plex Mono, monospace"
        fill={COLORS.textMuted}
      >
        D{node.depth}
      </text>
    </g>
  )
})

export default TreeNode
