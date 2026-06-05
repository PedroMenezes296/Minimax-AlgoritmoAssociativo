import React from 'react'
import AlgorithmToggle from './AlgorithmToggle.jsx'

export default function Header({ useAlphaBeta, onToggle, isAnimating }) {
  return (
    <header style={{
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
        <h1 style={{
          margin: 0,
          fontFamily: 'var(--font-display)',
          fontSize: '20px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '0.1em',
          textShadow: '0 0 20px rgba(0,191,255,0.3)',
        }}>
          MINIMAX VISUALIZER
        </h1>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '11px',
          color: 'var(--text-muted)',
          letterSpacing: '0.05em',
        }}>
          JOGO DA VELHA × TEORIA DA COMPUTAÇÃO
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {isAnimating && (
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '11px',
            color: 'var(--accent-min)',
            animation: 'aiThinking 1s ease-in-out infinite',
            letterSpacing: '0.1em',
          }}>
            ● IA PENSANDO...
          </span>
        )}
        <AlgorithmToggle
          useAlphaBeta={useAlphaBeta}
          onChange={onToggle}
          disabled={isAnimating}
        />
      </div>
    </header>
  )
}
