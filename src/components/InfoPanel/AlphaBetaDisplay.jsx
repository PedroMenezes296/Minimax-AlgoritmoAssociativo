import React from 'react'
import { COLORS } from '../../constants/colors.js'

export default function AlphaBetaDisplay({ alpha, beta }) {
  const alphaStr = alpha === -Infinity ? '-∞' : alpha
  const betaStr  = beta  === +Infinity ? '+∞' : beta

  return (
    <div style={{ display: 'flex', gap: '16px', padding: '6px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '13px', color: COLORS.accentMax, textShadow: `0 0 6px ${COLORS.accentMax}` }}>
          α
        </span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', color: 'var(--text-primary)', minWidth: '24px' }}>
          {alphaStr}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '13px', color: COLORS.accentMin, textShadow: `0 0 6px ${COLORS.accentMin}` }}>
          β
        </span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', color: 'var(--text-primary)', minWidth: '24px' }}>
          {betaStr}
        </span>
      </div>
    </div>
  )
}
