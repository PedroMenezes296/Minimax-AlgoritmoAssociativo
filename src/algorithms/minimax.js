import { checkWinner, getAvailableMoves, applyMove } from '../utils/boardHelpers.js'

// board: number[9]  0=empty  aiPlayer=1 or -1  humanPlayer=-aiPlayer
// Returns { nodes, bestMove, stats }

export function runMinimax(board, useAlphaBeta, aiPlayer = 1) {
  const humanPlayer = -aiPlayer
  const nodes = []
  let nodeCounter = 0
  const bestChildMap = {}

  function minimax(board, depth, isMaximizing, alpha, beta, parentId) {
    const id = nodeCounter++
    const type = isMaximizing ? 'MAX' : 'MIN'
    const winner = checkWinner(board)
    const isLeaf = winner !== null

    const nodeInfo = {
      id,
      parentId,
      depth,
      type,
      board: [...board],
      value: null,
      isPruned: false,
      isLeaf,
      isChosenPath: false,
      alpha,
      beta,
      childIds: [],
    }
    nodes.push(nodeInfo)

    if (isLeaf) {
      // Normalize: +1 if AI won, -1 if human won, 0 draw
      let val = 0
      if (winner === aiPlayer)    val = 1
      if (winner === humanPlayer) val = -1
      nodeInfo.value = val
      return { value: val, id }
    }

    const moves = getAvailableMoves(board)
    let bestValue = isMaximizing ? -Infinity : +Infinity
    let bestChildId = null

    for (let mi = 0; mi < moves.length; mi++) {
      const move = moves[mi]
      const player = isMaximizing ? aiPlayer : humanPlayer
      const nextBoard = applyMove(board, move, player)
      const result = minimax(nextBoard, depth + 1, !isMaximizing, alpha, beta, id)
      nodeInfo.childIds.push(result.id)

      if (isMaximizing) {
        if (result.value > bestValue) {
          bestValue = result.value
          bestChildId = result.id
        }
        if (useAlphaBeta) {
          alpha = Math.max(alpha, bestValue)
          if (beta <= alpha) {
            addPrunedPlaceholders(board, moves, mi + 1, aiPlayer, id, depth + 1, 'MAX', alpha, beta, nodeInfo)
            break
          }
        }
      } else {
        if (result.value < bestValue) {
          bestValue = result.value
          bestChildId = result.id
        }
        if (useAlphaBeta) {
          beta = Math.min(beta, bestValue)
          if (beta <= alpha) {
            addPrunedPlaceholders(board, moves, mi + 1, humanPlayer, id, depth + 1, 'MIN', alpha, beta, nodeInfo)
            break
          }
        }
      }
    }

    nodeInfo.value = bestValue
    if (bestChildId !== null) bestChildMap[id] = bestChildId
    return { value: bestValue, id, bestChildId }
  }

  function addPrunedPlaceholders(board, moves, fromIdx, player, parentId, depth, type, alpha, beta, parentNode) {
    for (let ri = fromIdx; ri < moves.length; ri++) {
      const prunedBoard = applyMove(board, moves[ri], player)
      const prunedId = nodeCounter++
      const prunedNode = {
        id: prunedId,
        parentId,
        depth,
        type,
        board: prunedBoard,
        value: null,
        isPruned: true,
        isLeaf: false,
        isChosenPath: false,
        alpha,
        beta,
        childIds: [],
      }
      nodes.push(prunedNode)
      parentNode.childIds.push(prunedId)
    }
  }

  const rootResult = minimax(board, 0, true, -Infinity, +Infinity, null)

  // Post-process: mark chosen path
  let cur = rootResult.id
  while (cur !== null && cur !== undefined) {
    const node = nodes[cur]
    if (!node) break
    node.isChosenPath = true
    cur = bestChildMap[cur] ?? null
  }

  // Find bestMove: cell where root board and best child board differ (by aiPlayer value)
  const bestMove = (() => {
    const root = nodes[0]
    if (!root) return null
    const bestChildId = bestChildMap[0]
    if (bestChildId === undefined) return null
    const bestChild = nodes.find(n => n.id === bestChildId)
    if (!bestChild) return null
    for (let i = 0; i < 9; i++) {
      if (root.board[i] === 0 && bestChild.board[i] === aiPlayer) return i
    }
    return null
  })()

  const prunedNodes = nodes.filter(n => n.isPruned).length
  const maxDepth = Math.max(...nodes.map(n => n.depth))

  return {
    nodes,
    bestMove,
    stats: { totalNodes: nodes.length, prunedNodes, maxDepth },
  }
}
