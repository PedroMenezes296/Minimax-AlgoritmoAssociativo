import React from 'react'

function Btn({ children, onClick, disabled, color = 'var(--accent-max)', small }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: small ? '11px' : '13px',
        letterSpacing: '0.1em',
        color: disabled ? 'var(--text-muted)' : color,
        background: 'var(--bg-card)',
        border: `1px solid ${disabled ? 'var(--border)' : color}`,
        borderRadius: '6px',
        padding: small ? '6px 14px' : '8px 18px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'box-shadow 0.15s, border-color 0.15s',
        boxShadow: disabled ? 'none' : `0 0 6px ${color}44`,
      }}
      onMouseEnter={e => !disabled && (e.currentTarget.style.boxShadow = `0 0 14px ${color}88`)}
      onMouseLeave={e => !disabled && (e.currentTarget.style.boxShadow = `0 0 6px ${color}44`)}
    >
      {children}
    </button>
  )
}

export default function Controls({ gamePhase, onRestart, onChooseSide }) {
  const midGame = gamePhase === 'human_turn' || gamePhase === 'ai_thinking'
  const canChoose = !midGame

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
      <Btn onClick={onRestart} disabled={gamePhase === 'setup'} color="var(--text-primary)">
        ↺ REINICIAR
      </Btn>

      {canChoose && (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Btn small onClick={() => onChooseSide('X')} color="var(--win-human)">
            JOGAR COMO X
          </Btn>
          <Btn small onClick={() => onChooseSide('O')} color="var(--win-ai)">
            JOGAR COMO O
          </Btn>
        </div>
      )}

      {midGame && (
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
          Troca de lado disponível<br/>após reiniciar
        </div>
      )}
    </div>
  )
}
