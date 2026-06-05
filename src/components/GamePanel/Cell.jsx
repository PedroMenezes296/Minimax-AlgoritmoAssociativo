import React, { useState } from 'react'

const SYMBOL_COLORS = {
  X: 'var(--win-human)',
  O: 'var(--win-ai)',
}

export default function Cell({ value, onClick, isWinning, disabled }) {
  const [hovered, setHovered] = useState(false)

  const symbol = value === -1 ? 'X' : value === 1 ? 'O' : null
  const color = symbol ? SYMBOL_COLORS[symbol] : 'transparent'
  const isEmpty = value === 0

  const glowColor = isWinning
    ? (symbol === 'X' ? 'var(--win-human)' : 'var(--win-ai)')
    : hovered && isEmpty
      ? 'rgba(0,191,255,0.3)'
      : 'transparent'

  return (
    <button
      onClick={onClick}
      disabled={disabled || !isEmpty}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: isWinning ? 'rgba(255,255,255,0.05)' : 'var(--bg-card)',
        border: `1px solid ${hovered && isEmpty ? 'var(--accent-max)' : 'var(--border)'}`,
        borderRadius: '6px',
        cursor: isEmpty && !disabled ? 'pointer' : 'default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontSize: '42px',
        fontWeight: 700,
        color,
        width: '100%',
        aspectRatio: '1',
        transition: 'border-color 0.15s, box-shadow 0.15s, background 0.15s',
        boxShadow: isWinning
          ? `0 0 20px ${glowColor}, inset 0 0 20px ${glowColor}`
          : hovered && isEmpty
            ? `0 0 12px rgba(0,191,255,0.3)`
            : 'none',
        textShadow: symbol ? `0 0 16px ${color}` : 'none',
        animation: isWinning ? 'winPulse 0.8s ease-in-out infinite' : 'none',
        padding: 0,
      }}
    >
      {symbol}
    </button>
  )
}
