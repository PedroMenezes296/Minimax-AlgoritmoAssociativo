import React, { useRef, useState, useCallback, useMemo } from 'react'
import TreeNode from './TreeNode.jsx'
import TreeEdge from './TreeEdge.jsx'
import { NODE_H } from '../../utils/treeLayout.js'
import { COLORS } from '../../constants/colors.js'

export default function TreeCanvas({ nodes, positions, svgDims, animatedUpTo, renderDepth, onSkip, isAnimating }) {
  const svgRef = useRef(null)
  const [pan, setPan] = useState({ x: 20, y: 20 })
  const [zoom, setZoom] = useState(1)
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef(null)

  const visibleNodes = useMemo(
    () => (nodes || []).filter(n => n.depth <= renderDepth),
    [nodes, renderDepth]
  )

  // Build edges list
  const edges = useMemo(() => {
    const result = []
    for (const node of visibleNodes) {
      if (node.parentId === null) continue
      const parentPos = positions.get(node.parentId)
      const childPos = positions.get(node.id)
      if (!parentPos || !childPos) continue
      result.push({
        key: `${node.parentId}-${node.id}`,
        parentPos,
        childPos,
        isChosenPath: node.isChosenPath,
        isPruned: node.isPruned,
        parentId: node.parentId,
        childId: node.id,
      })
    }
    return result
  }, [visibleNodes, positions])

  const handlePointerDown = useCallback((e) => {
    setDragging(true)
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y }
    e.currentTarget.setPointerCapture(e.pointerId)
  }, [pan])

  const handlePointerMove = useCallback((e) => {
    if (!dragging || !dragStart.current) return
    setPan({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y })
  }, [dragging])

  const handlePointerUp = useCallback(() => {
    setDragging(false)
    dragStart.current = null
  }, [])

  const handleWheel = useCallback((e) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoom(z => Math.max(0.1, Math.min(3, z * delta)))
  }, [])

  const resetView = useCallback(() => {
    setPan({ x: 20, y: 20 })
    setZoom(1)
  }, [])

  if (!nodes || nodes.length === 0) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-body)',
        fontSize: '13px',
        letterSpacing: '0.05em',
        flexDirection: 'column',
        gap: '8px',
      }}>
        <div style={{ fontSize: '24px', opacity: 0.3 }}>◈</div>
        <div>Faça uma jogada para ver a árvore de decisão</div>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
      {/* Controls overlay */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        display: 'flex',
        gap: '6px',
        zIndex: 10,
      }}>
        {isAnimating && (
          <button
            onClick={onSkip}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '10px',
              letterSpacing: '0.1em',
              color: 'var(--accent-min)',
              background: 'var(--bg-card)',
              border: '1px solid var(--accent-min)',
              borderRadius: '4px',
              padding: '4px 10px',
              cursor: 'pointer',
            }}
          >
            ⏭ PULAR
          </button>
        )}
        <button
          onClick={resetView}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '10px',
            letterSpacing: '0.1em',
            color: 'var(--text-muted)',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            padding: '4px 10px',
            cursor: 'pointer',
          }}
        >
          ⊹ RESET VIEW
        </button>
      </div>

      {/* Depth info */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        fontFamily: 'var(--font-body)',
        fontSize: '10px',
        color: 'var(--text-muted)',
        zIndex: 10,
      }}>
        Mostrando profundidade 0–{renderDepth} · {visibleNodes.length} nós renderizados
      </div>

      <div
        style={{ width: '100%', height: '100%', cursor: dragging ? 'grabbing' : 'grab', overflow: 'hidden' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          style={{ display: 'block' }}
        >
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Edges first (behind nodes) */}
            {edges
              .filter(e => e.parentId <= animatedUpTo && e.childId <= animatedUpTo)
              .map(e => (
                <TreeEdge
                  key={e.key}
                  parentPos={e.parentPos}
                  childPos={e.childPos}
                  isChosenPath={e.isChosenPath}
                  isPruned={e.isPruned}
                />
              ))
            }

            {/* Nodes */}
            {visibleNodes.map(node => {
              const pos = positions.get(node.id)
              if (!pos) return null
              return (
                <TreeNode
                  key={node.id}
                  node={node}
                  pos={pos}
                  animatedUpTo={animatedUpTo}
                />
              )
            })}
          </g>
        </svg>
      </div>
    </div>
  )
}
