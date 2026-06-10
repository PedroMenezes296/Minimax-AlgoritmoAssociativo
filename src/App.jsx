import React, { useState, useCallback, useEffect, useRef } from 'react'
import Header from './components/Header/Header.jsx'
import GamePanel from './components/GamePanel/GamePanel.jsx'
import TreePanel from './components/TreePanel/TreePanel.jsx'
import InfoPanel from './components/InfoPanel/InfoPanel.jsx'
import { useGameState } from './hooks/useGameState.js'
import { useTreeAnimation } from './hooks/useTreeAnimation.js'
import { useTreeLayout } from './hooks/useTreeLayout.js'

export default function App() {
  const [useAlphaBeta, setUseAlphaBeta] = useState(false)
  const [treeData, setTreeData] = useState(null)
  const [expandedNodes, setExpandedNodes] = useState(new Set())
  const [userRevealedIds, setUserRevealedIds] = useState(new Set())

  const onTreeReady = useCallback((result) => {
    setTreeData(result)
  }, [])

  const {
    board,
    humanPlayer,
    currentPlayer,
    gamePhase,
    winner,
    winningLine,
    score,
    makeMove,
    restartGame,
    startGame,
  } = useGameState(useAlphaBeta, onTreeReady)

  const { animatedUpTo, isAnimating, currentAlpha, currentBeta, stepLog, skip } =
    useTreeAnimation(treeData?.nodes)

  const { positions, svgDims } = useTreeLayout(treeData?.nodes, expandedNodes)

  // Reset expanded state when a new tree arrives — start with root only
  // Also immediately reveal root's children so they don't wait for DFS animation
  useEffect(() => {
    if (treeData?.nodes?.length > 0) {
      const root = treeData.nodes[0]
      setExpandedNodes(new Set([root.id]))
      setUserRevealedIds(new Set(root.childIds || []))
    } else {
      setExpandedNodes(new Set())
      setUserRevealedIds(new Set())
    }
  }, [treeData])

  // After animation ends, auto-expand chosen path nodes
  const prevIsAnimating = useRef(false)
  useEffect(() => {
    if (prevIsAnimating.current && !isAnimating && treeData?.nodes) {
      const chosenIds = treeData.nodes
        .filter(n => n.isChosenPath)
        .map(n => n.id)
      setExpandedNodes(prev => new Set([...prev, ...chosenIds]))
    }
    prevIsAnimating.current = isAnimating
  }, [isAnimating, treeData])

  const toggleExpandNode = useCallback((nodeId) => {
    setExpandedNodes(prev => {
      const next = new Set(prev)
      if (next.has(nodeId)) {
        next.delete(nodeId)
      } else {
        next.add(nodeId)
        // Immediately reveal children so they bypass the DFS animation gate
        const node = treeData?.nodes?.[nodeId]
        if (node?.childIds?.length) {
          setUserRevealedIds(prev => new Set([...prev, ...node.childIds]))
        }
      }
      return next
    })
  }, [treeData])

  const handleCellClick = useCallback((index) => {
    if (gamePhase !== 'human_turn') return
    makeMove(index, board, humanPlayer)
  }, [gamePhase, makeMove, board, humanPlayer])

  const handleRestart = useCallback(() => {
    setTreeData(null)
    restartGame(humanPlayer)
  }, [restartGame, humanPlayer])

  const handleChooseSide = useCallback((side) => {
    setTreeData(null)
    startGame(side)
  }, [startGame])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Header
        useAlphaBeta={useAlphaBeta}
        onToggle={setUseAlphaBeta}
        isAnimating={isAnimating}
      />

      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '320px 1fr 220px',
        gap: '12px',
        padding: '12px',
        overflow: 'hidden',
        minHeight: 0,
      }}>
        {/* Left: Game */}
        <GamePanel
          board={board}
          winningLine={winningLine}
          gamePhase={gamePhase}
          winner={winner}
          humanPlayer={humanPlayer}
          currentPlayer={currentPlayer}
          score={score}
          onCellClick={handleCellClick}
          onRestart={handleRestart}
          onChooseSide={handleChooseSide}
        />

        {/* Center: Tree */}
        <TreePanel
          nodes={treeData?.nodes}
          positions={positions}
          svgDims={svgDims}
          animatedUpTo={animatedUpTo}
          stats={treeData?.stats}
          isAnimating={isAnimating}
          useAlphaBeta={useAlphaBeta}
          onSkip={skip}
          expandedNodes={expandedNodes}
          onToggleExpand={toggleExpandNode}
          userRevealedIds={userRevealedIds}
        />

        {/* Right: Info */}
        <InfoPanel
          stepLog={stepLog}
          currentAlpha={currentAlpha}
          currentBeta={currentBeta}
          useAlphaBeta={useAlphaBeta}
          stats={treeData?.stats}
          gamePhase={gamePhase}
        />
      </div>
    </div>
  )
}
