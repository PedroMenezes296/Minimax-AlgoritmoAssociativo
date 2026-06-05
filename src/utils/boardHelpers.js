// board: number[9]  0=empty  1=AI  -1=human
// Returns: +1 AI wins | -1 human wins | 0 draw | null ongoing

const LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
]

export function checkWinner(board) {
  for (const [a, b, c] of LINES) {
    if (board[a] !== 0 && board[a] === board[b] && board[a] === board[c]) {
      return board[a]
    }
  }
  if (board.every(cell => cell !== 0)) return 0
  return null
}

export function getWinningLine(board) {
  for (const line of LINES) {
    const [a, b, c] = line
    if (board[a] !== 0 && board[a] === board[b] && board[a] === board[c]) {
      return line
    }
  }
  return null
}

export function getAvailableMoves(board) {
  return board.reduce((moves, cell, i) => {
    if (cell === 0) moves.push(i)
    return moves
  }, [])
}

export function applyMove(board, index, player) {
  const next = [...board]
  next[index] = player
  return next
}

export const EMPTY_BOARD = Array(9).fill(0)
