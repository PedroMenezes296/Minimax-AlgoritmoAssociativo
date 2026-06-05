import React, { useEffect, useRef } from 'react'

export default function StepLog({ entries }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [entries])

  if (entries.length === 0) {
    return (
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: '11px',
        color: 'var(--text-muted)',
        padding: '8px',
        fontStyle: 'italic',
      }}>
        Log de passos aparecerá aqui durante a animação...
      </div>
    )
  }

  return (
    <div style={{
      fontFamily: 'var(--font-body)',
      fontSize: '11px',
      lineHeight: '1.6',
      overflowY: 'auto',
      maxHeight: '100%',
      padding: '4px 0',
    }}>
      {entries.map((entry, i) => (
        <div
          key={i}
          style={{
            color: i === entries.length - 1 ? 'var(--text-primary)' : 'var(--text-muted)',
            padding: '1px 8px',
            borderLeft: i === entries.length - 1 ? '2px solid var(--accent-max)' : '2px solid transparent',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {entry}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
