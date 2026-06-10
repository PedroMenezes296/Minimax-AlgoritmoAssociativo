import { useState, useEffect, useRef, useCallback } from 'react'

export function useTreeAnimation(nodes) {
  const [animatedUpTo, setAnimatedUpTo] = useState(-1)
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentAlpha, setCurrentAlpha] = useState(-Infinity)
  const [currentBeta, setCurrentBeta] = useState(+Infinity)
  const [stepLog, setStepLog] = useState([])
  const intervalRef = useRef(null)
  const currentRef = useRef(0)

  const skip = useCallback(() => {
    if (!nodes || nodes.length === 0) return
    clearInterval(intervalRef.current)
    setAnimatedUpTo(nodes[nodes.length - 1]?.id ?? -1)
    setIsAnimating(false)
    const lastNode = nodes.at(-1)
    if (lastNode) {
      setCurrentAlpha(lastNode.alpha)
      setCurrentBeta(lastNode.beta)
    }
  }, [nodes])

  useEffect(() => {
    if (!nodes || nodes.length === 0) {
      setAnimatedUpTo(-1)
      setIsAnimating(false)
      setStepLog([])
      return
    }

    clearInterval(intervalRef.current)
    setAnimatedUpTo(-1)
    setStepLog([])
    setIsAnimating(true)
    setCurrentAlpha(-Infinity)
    setCurrentBeta(+Infinity)
    currentRef.current = 0

    const delay = Math.max(4, Math.min(15, 800 / Math.max(nodes.length, 1)))

    intervalRef.current = setInterval(() => {
      const cur = currentRef.current
      if (cur >= nodes.length) {
        clearInterval(intervalRef.current)
        setIsAnimating(false)
        return
      }

      const node = nodes[cur]
      setAnimatedUpTo(node.id)
      setCurrentAlpha(node.alpha)
      setCurrentBeta(node.beta)

      if (node.depth <= 3) {
        const alphaStr = node.alpha === -Infinity ? '-∞' : node.alpha
        const betaStr  = node.beta  === +Infinity ? '+∞' : node.beta
        const valStr   = node.value !== null ? (node.value > 0 ? `+${node.value}` : `${node.value}`) : '?'
        const pruneTag = node.isPruned ? ' [✂ PODADO]' : ''
        const pathTag  = node.isChosenPath ? ' ★' : ''

        const entry = `[D${node.depth}] ${node.type} | pos:${node.board.lastIndexOf(node.type === 'MAX' ? 1 : -1)} | val:${valStr} | α=${alphaStr} β=${betaStr}${pruneTag}${pathTag}`
        setStepLog(prev => [...prev.slice(-49), entry])
      }

      currentRef.current = cur + 1
    }, delay)

    return () => clearInterval(intervalRef.current)
  }, [nodes]) // eslint-disable-line react-hooks/exhaustive-deps

  return { animatedUpTo, isAnimating, currentAlpha, currentBeta, stepLog, skip }
}
