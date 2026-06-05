import React from 'react'
import Board from './Board.jsx'
import StatusBar from './StatusBar.jsx'
import Controls from './Controls.jsx'

export default function GamePanel({
  board, winningLine, gamePhase, winner, humanPlayer, currentPlayer, score,
  onCellClick, onRestart, onChooseSide,
}) {
  const boardDisabled = gamePhase !== 'human_turn'

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      alignItems: 'center',
      minWidth: '280px',
      maxWidth: '320px',
    }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '11px',
        color: 'var(--text-muted)',
        letterSpacing: '0.15em',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '12px',
        width: '100%',
        textAlign: 'center',
      }}>
        JOGO DA VELHA
      </div>

      <StatusBar
        gamePhase={gamePhase}
        winner={winner}
        humanPlayer={humanPlayer}
        currentPlayer={currentPlayer}
        score={score}
      />

      <Board
        board={board}
        onCellClick={onCellClick}
        winningLine={winningLine}
        disabled={boardDisabled}
      />

      <Controls
        gamePhase={gamePhase}
        onRestart={onRestart}
        onChooseSide={onChooseSide}
      />
    </div>
  )
}
