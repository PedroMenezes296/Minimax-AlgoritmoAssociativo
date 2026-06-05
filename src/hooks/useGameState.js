import { useState, useCallback, useRef, useEffect } from 'react'
import { checkWinner, getWinningLine, EMPTY_BOARD, applyMove } from '../utils/boardHelpers.js'
import { runMinimax } from '../algorithms/minimax.js'

// gamePhase: 'setup' | 'human_turn' | 'ai_thinking' | 'game_over'

export function useGameState(useAlphaBeta, onTreeReady) {
  const [board, setBoard] = useState([...EMPTY_BOARD])
  const [humanPlayer, setHumanPlayer] = useState(-1)
  const [currentPlayer, setCurrentPlayer] = useState(-1)
  const [gamePhase, setGamePhase] = useState('setup')
  const [winner, setWinner] = useState(null)
  const [winningLine, setWinningLine] = useState(null)
  const [score, setScore] = useState({ human: 0, ai: 0, draw: 0 })

  const useAlphaBetaRef = useRef(useAlphaBeta)
  const onTreeReadyRef  = useRef(onTreeReady)
  useEffect(() => { useAlphaBetaRef.current = useAlphaBeta }, [useAlphaBeta])
  useEffect(() => { onTreeReadyRef.current  = onTreeReady  }, [onTreeReady])

  const endGame = useCallback((result, boardState, hp) => {
    const line = result !== 0 ? getWinningLine(boardState) : null
    setWinningLine(line)
    setWinner(result)
    setGamePhase('game_over')
    setScore(prev => {
      if (result === hp)  return { ...prev, human: prev.human + 1 }
      if (result === 0)   return { ...prev, draw:  prev.draw  + 1 }
      return { ...prev, ai: prev.ai + 1 }
    })
  }, [])

  const runAiTurn = useCallback((boardState, hp) => {
    const ap = -hp
    setGamePhase('ai_thinking')

    setTimeout(() => {
      const result = runMinimax(boardState, useAlphaBetaRef.current, ap)
      onTreeReadyRef.current(result)

      if (result.bestMove === null) {
        endGame(0, boardState, hp)
        return
      }

      const nextBoard = applyMove(boardState, result.bestMove, ap)
      setBoard(nextBoard)
      setCurrentPlayer(hp)

      const w = checkWinner(nextBoard)
      if (w !== null) endGame(w, nextBoard, hp)
      else setGamePhase('human_turn')
    }, 0)
  }, [endGame])

  const makeMove = useCallback((index, currentBoard, hp) => {
    if (currentBoard[index] !== 0) return

    const nextBoard = applyMove(currentBoard, index, hp)
    setBoard(nextBoard)
    setCurrentPlayer(-hp)

    const w = checkWinner(nextBoard)
    if (w !== null) endGame(w, nextBoard, hp)
    else runAiTurn(nextBoard, hp)
  }, [endGame, runAiTurn])

  const restartGame = useCallback((hp) => {
    setBoard([...EMPTY_BOARD])
    setWinner(null)
    setWinningLine(null)
    setCurrentPlayer(hp)
    setGamePhase('human_turn')
  }, [])

  const startGame = useCallback((side) => {
    const hp = side === 'X' ? -1 : 1
    setHumanPlayer(hp)
    setBoard([...EMPTY_BOARD])
    setWinner(null)
    setWinningLine(null)

    if (hp === -1) {
      setCurrentPlayer(-1)
      setGamePhase('human_turn')
    } else {
      // AI is X (-1), goes first
      setCurrentPlayer(-1)
      runAiTurn([...EMPTY_BOARD], hp)
    }
  }, [runAiTurn])

  return {
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
  }
}
