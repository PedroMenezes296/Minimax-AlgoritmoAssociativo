import React from 'react'
import { COLORS } from '../../constants/colors.js'

function StatItem({ label, value, color, show = true }) {
  if (!show) return null
  return (
    <div style={{ textAlign: 'center', minWidth: '100px' }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '22px',
        fontWeight: 700,
        color,
        textShadow: `0 0 10px ${color}88`,
        letterSpacing: '0.05em',
        animation: 'countUp 0.15s ease-out',
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: '9px',
        color: 'var(--text-muted)',
        letterSpacing: '0.1em',
        marginTop: '2px',
      }}>
        {label}
      </div>
    </div>
  )
}

export default function StatsBar({ stats, isAnimating, useAlphaBeta }) {
  if (!stats) return (
    <div style={{
      padding: '10px 16px',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '32px',
      background: 'var(--bg-secondary)',
      minHeight: '60px',
    }}>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--text-muted)' }}>
        — aguardando jogada —
      </span>
    </div>
  )

  return (
    <div style={{
      padding: '10px 16px',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '32px',
      background: 'var(--bg-secondary)',
      flexWrap: 'wrap',
    }}>
      <StatItem
        label="NÓS AVALIADOS"
        value={stats.totalNodes}
        color={COLORS.accentMax}
      />
      <StatItem
        label="NÓS PODADOS"
        value={stats.prunedNodes}
        color={COLORS.accentMin}
        show={useAlphaBeta}
      />
      <StatItem
        label="PROFUNDIDADE MÁX"
        value={stats.maxDepth}
        color={COLORS.draw}
      />
      {isAnimating && (
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '10px',
          color: 'var(--accent-min)',
          animation: 'aiThinking 1s ease-in-out infinite',
          letterSpacing: '0.1em',
        }}>
          ● ANIMANDO
        </div>
      )}
    </div>
  )
}
