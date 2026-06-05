import React from 'react'

function getStatusText(gamePhase, winner, humanPlayer, currentPlayer) {
  if (gamePhase === 'setup') return { text: 'ESCOLHA SEU LADO', color: 'var(--text-muted)' }
  if (gamePhase === 'ai_thinking') return { text: '⚡ IA CALCULANDO...', color: 'var(--accent-min)', pulse: true }

  if (gamePhase === 'game_over') {
    if (winner === 0) return { text: '◈ EMPATE', color: 'var(--draw)' }
    if (winner === humanPlayer) return { text: '✓ VOCÊ VENCEU!', color: 'var(--win-ai)' }
    return { text: '✗ IA VENCEU', color: 'var(--win-human)' }
  }

  // human_turn
  const symbol = currentPlayer === -1 ? 'X' : 'O'
  const isHumanTurn = currentPlayer === humanPlayer
  if (isHumanTurn) return { text: `SUA VEZ  [${symbol}]`, color: 'var(--text-primary)' }
  return { text: `VEZ DA IA  [${symbol}]`, color: 'var(--accent-min)' }
}

export default function StatusBar({ gamePhase, winner, humanPlayer, currentPlayer, score }) {
  const { text, color, pulse } = getStatusText(gamePhase, winner, humanPlayer, currentPlayer)

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '15px',
        color,
        letterSpacing: '0.12em',
        animation: pulse ? 'aiThinking 1s ease-in-out infinite' : 'none',
        textShadow: `0 0 10px ${color}66`,
        minHeight: '24px',
        marginBottom: '12px',
      }}>
        {text}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontFamily: 'var(--font-display)', fontSize: '12px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--win-ai)', fontSize: '20px', fontWeight: 700, textShadow: '0 0 8px var(--win-ai)' }}>{score.human}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '10px', letterSpacing: '0.1em' }}>VOCÊ</div>
        </div>
        <div style={{ textAlign: 'center', color: 'var(--border)', fontSize: '20px' }}>—</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--draw)', fontSize: '20px', fontWeight: 700, textShadow: '0 0 8px var(--draw)' }}>{score.draw}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '10px', letterSpacing: '0.1em' }}>EMPATE</div>
        </div>
        <div style={{ textAlign: 'center', color: 'var(--border)', fontSize: '20px' }}>—</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--win-human)', fontSize: '20px', fontWeight: 700, textShadow: '0 0 8px var(--win-human)' }}>{score.ai}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '10px', letterSpacing: '0.1em' }}>IA</div>
        </div>
      </div>
    </div>
  )
}
