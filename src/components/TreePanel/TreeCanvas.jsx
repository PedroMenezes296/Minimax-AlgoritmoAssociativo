import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react'
import TreeNode from './TreeNode.jsx'
import TreeEdge from './TreeEdge.jsx'
import { NODE_H } from '../../utils/treeLayout.js'
import { COLORS } from '../../constants/colors.js'

export default function TreeCanvas({ nodes, positions, svgDims, animatedUpTo, onSkip, isAnimating, expandedNodes, onToggleExpand, userRevealedIds }) {
  const svgRef = useRef(null)
  const [pan, setPan] = useState({ x: 20, y: 20 })
  const [zoom, setZoom] = useState(1)
  const [dragging, setDragging] = useState(false)
  const [smoothTransition, setSmoothTransition] = useState(false)
  const dragStart = useRef(null)
  const isDraggingRef = useRef(false)
  const prevIsAnimating = useRef(false)

  const visibleNodes = useMemo(
    () => (nodes || []).filter(n => n.depth === 0 || (expandedNodes && expandedNodes.has(n.parentId))),
    [nodes, expandedNodes]
  )

  // Keep refs up-to-date so the auto-pan rAF callback sees the latest values
  const visibleNodesRef = useRef(visibleNodes)
  visibleNodesRef.current = visibleNodes
  const positionsRef = useRef(positions)
  positionsRef.current = positions
  const zoomRef = useRef(zoom)
  zoomRef.current = zoom

  const visibleIds = useMemo(() => new Set(visibleNodes.map(n => n.id)), [visibleNodes])

  // Count hidden children for each visible node
  const nodeHiddenChildCount = useMemo(() => {
    const map = new Map()
    for (const node of visibleNodes) {
      const totalChildren = node.childIds?.length || 0
      const visibleChildren = (node.childIds || []).filter(cid => visibleIds.has(cid)).length
      map.set(node.id, totalChildren - visibleChildren)
    }
    return map
  }, [visibleNodes, visibleIds])

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

  // Auto-pan to chosen path after animation ends
  // Uses rAF so App.jsx has time to expand chosen path nodes first
  useEffect(() => {
    if (prevIsAnimating.current && !isAnimating) {
      requestAnimationFrame(() => {
        const chosen = visibleNodesRef.current.filter(n => n.isChosenPath)
        if (chosen.length === 0 || !svgRef.current) return
        const chosenPos = chosen.map(n => positionsRef.current.get(n.id)).filter(Boolean)
        if (chosenPos.length === 0) return
        const svgRect = svgRef.current.getBoundingClientRect()
        const xs = chosenPos.map(p => p.x)
        const ys = chosenPos.map(p => p.y)
        const centerX = (Math.min(...xs) + Math.max(...xs)) / 2
        const topY = Math.min(...ys)
        const targetX = svgRect.width / 2 - centerX * zoomRef.current
        const targetY = svgRect.height * 0.3 - topY * zoomRef.current
        setSmoothTransition(true)
        setPan({ x: targetX, y: targetY })
        setTimeout(() => setSmoothTransition(false), 900)
      })
    }
    prevIsAnimating.current = isAnimating
  }, [isAnimating])

  const handlePointerDown = useCallback((e) => {
    isDraggingRef.current = false
    setSmoothTransition(false)
    setDragging(true)
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y }
    e.currentTarget.setPointerCapture(e.pointerId)
  }, [pan])

  const handlePointerMove = useCallback((e) => {
    if (!dragging || !dragStart.current) return
    isDraggingRef.current = true
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
    setSmoothTransition(true)
    setPan({ x: 20, y: 20 })
    setZoom(1)
    setTimeout(() => setSmoothTransition(false), 900)
  }, [])

  // Wrapped toggle: ignore if user was dragging
  const handleToggleExpand = useCallback((nodeId) => {
    if (isDraggingRef.current) return
    onToggleExpand(nodeId)
  }, [onToggleExpand])

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

      {/* Info */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        fontFamily: 'var(--font-body)',
        fontSize: '10px',
        color: 'var(--text-muted)',
        zIndex: 10,
      }}>
        {visibleNodes.length} nós visíveis · scroll para zoom · arraste para mover
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
          <g style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transition: smoothTransition ? 'transform 0.8s ease-in-out' : 'none',
          }}>
            {/* Edges first (behind nodes) */}
            {edges
              .filter(e => {
                const revealed = userRevealedIds || new Set()
                const parentOk = e.parentId <= animatedUpTo || revealed.has(e.parentId)
                const childOk  = e.childId  <= animatedUpTo || revealed.has(e.childId)
                return parentOk && childOk
              })
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
                  userRevealedIds={userRevealedIds}
                  hiddenChildCount={nodeHiddenChildCount.get(node.id) || 0}
                  isExpanded={expandedNodes ? expandedNodes.has(node.id) : false}
                  onToggle={handleToggleExpand}
                />
              )
            })}
          </g>
        </svg>
      </div>
    </div>
  )
}
