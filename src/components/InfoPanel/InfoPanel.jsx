import React from 'react'
import StepLog from './StepLog.jsx'
import AlphaBetaDisplay from './AlphaBetaDisplay.jsx'

export default function InfoPanel({ stepLog, currentAlpha, currentBeta, useAlphaBeta, stats, gamePhase }) {
  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      height: '100%',
    }}>
      <div style={{
        padding: '8px 14px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '10px',
          color: 'var(--text-muted)',
          letterSpacing: '0.15em',
        }}>
          LOG DE PASSOS
        </span>
        {useAlphaBeta && (
          <AlphaBetaDisplay alpha={currentAlpha} beta={currentBeta} />
        )}
      </div>

      <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
        <StepLog entries={stepLog} />
      </div>

      {stats && (
        <div style={{
          padding: '8px 14px',
          borderTop: '1px solid var(--border)',
          fontFamily: 'var(--font-body)',
          fontSize: '10px',
          color: 'var(--text-muted)',
          flexShrink: 0,
        }}>
          Última jogada: {stats.totalNodes} nós avaliados
          {useAlphaBeta && ` · ${stats.prunedNodes} podados`}
          {` · profundidade ${stats.maxDepth}`}
        </div>
      )}
    </div>
  )
}
