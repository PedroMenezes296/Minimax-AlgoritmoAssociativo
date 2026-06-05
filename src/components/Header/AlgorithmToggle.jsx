import React from 'react'

export default function AlgorithmToggle({ useAlphaBeta, onChange, disabled }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'var(--font-display)', fontSize: '13px' }}>
      <span style={{ color: !useAlphaBeta ? 'var(--accent-max)' : 'var(--text-muted)', transition: 'color 0.2s', textShadow: !useAlphaBeta ? '0 0 8px var(--accent-max)' : 'none' }}>
        MINIMAX
      </span>

      <button
        onClick={() => !disabled && onChange(!useAlphaBeta)}
        disabled={disabled}
        style={{
          position: 'relative',
          width: '52px',
          height: '26px',
          borderRadius: '13px',
          border: `1px solid ${useAlphaBeta ? 'var(--accent-min)' : 'var(--accent-max)'}`,
          background: 'var(--bg-secondary)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'border-color 0.2s',
          padding: 0,
          boxShadow: `0 0 8px ${useAlphaBeta ? 'var(--accent-min)' : 'var(--accent-max)'}44`,
        }}
        aria-label="Toggle algorithm mode"
      >
        <span style={{
          position: 'absolute',
          top: '3px',
          left: useAlphaBeta ? '28px' : '3px',
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          background: useAlphaBeta ? 'var(--accent-min)' : 'var(--accent-max)',
          transition: 'left 0.2s, background 0.2s',
          boxShadow: `0 0 6px ${useAlphaBeta ? 'var(--accent-min)' : 'var(--accent-max)'}`,
        }} />
      </button>

      <span style={{ color: useAlphaBeta ? 'var(--accent-min)' : 'var(--text-muted)', transition: 'color 0.2s', textShadow: useAlphaBeta ? '0 0 8px var(--accent-min)' : 'none' }}>
        ALFA-BETA
      </span>
    </div>
  )
}
