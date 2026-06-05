import React from 'react'
import { COLORS } from '../../constants/colors.js'

const items = [
  { color: COLORS.accentMax,  label: 'Nó MAX (IA maximiza)' },
  { color: COLORS.accentMin,  label: 'Nó MIN (humano minimiza)' },
  { color: COLORS.winAi,      label: 'Folha: vitória IA (+1)' },
  { color: COLORS.winHuman,   label: 'Folha: vitória humano (-1)' },
  { color: COLORS.draw,       label: 'Folha: empate (0)' },
  { color: COLORS.prunedText, label: 'Podado (✂ Alfa-Beta)' },
  { color: COLORS.pathChosen, label: 'Caminho escolhido ★' },
]

export default function Legend() {
  return (
    <div style={{
      padding: '10px 14px',
      borderTop: '1px solid var(--border)',
      background: 'var(--bg-secondary)',
    }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '9px',
        color: 'var(--text-muted)',
        letterSpacing: '0.12em',
        marginBottom: '8px',
      }}>
        LEGENDA
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px' }}>
        {items.map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '2px',
              background: color,
              boxShadow: `0 0 4px ${color}88`,
              flexShrink: 0,
            }} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'var(--text-muted)' }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
