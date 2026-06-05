import React from 'react'
import StatsBar from './StatsBar.jsx'
import TreeCanvas from './TreeCanvas.jsx'
import Legend from './Legend.jsx'

export default function TreePanel({
  nodes, positions, svgDims, animatedUpTo, stats, isAnimating, useAlphaBeta, onSkip,
  renderDepth, onRenderDepthChange,
}) {
  return (
    <div style={{
      flex: 1,
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      minHeight: 0,
    }}>
      {/* Header */}
      <div style={{
        padding: '10px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '11px',
          color: 'var(--text-muted)',
          letterSpacing: '0.15em',
        }}>
          ÁRVORE DE DECISÃO
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'var(--text-muted)' }}>
            PROFUNDIDADE:
          </label>
          <input
            type="range"
            min={1} max={7}
            value={renderDepth}
            onChange={e => onRenderDepthChange(Number(e.target.value))}
            style={{ accentColor: 'var(--accent-max)', width: '80px' }}
          />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '12px', color: 'var(--accent-max)', minWidth: '16px' }}>
            {renderDepth}
          </span>
        </div>
      </div>

      {/* Stats */}
      <StatsBar stats={stats} isAnimating={isAnimating} useAlphaBeta={useAlphaBeta} />

      {/* Tree canvas */}
      <TreeCanvas
        nodes={nodes}
        positions={positions}
        svgDims={svgDims}
        animatedUpTo={animatedUpTo}
        renderDepth={renderDepth}
        onSkip={onSkip}
        isAnimating={isAnimating}
      />

      {/* Legend */}
      <Legend />
    </div>
  )
}
