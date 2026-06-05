import React from 'react'
import Cell from './Cell.jsx'

export default function Board({ board, onCellClick, winningLine, disabled }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '8px',
      width: '100%',
      maxWidth: '280px',
      margin: '0 auto',
    }}>
      {board.map((cell, i) => (
        <Cell
          key={i}
          value={cell}
          onClick={() => onCellClick(i)}
          isWinning={winningLine?.includes(i) ?? false}
          disabled={disabled}
        />
      ))}
    </div>
  )
}
