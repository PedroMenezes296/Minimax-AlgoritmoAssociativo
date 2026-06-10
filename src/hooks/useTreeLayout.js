import { useMemo } from 'react'
import { computeLayout, getSvgDimensions } from '../utils/treeLayout.js'

export function useTreeLayout(nodes, expandedNodes) {
  const positions = useMemo(
    () => computeLayout(nodes, expandedNodes),
    [nodes, expandedNodes]
  )

  const svgDims = useMemo(
    () => getSvgDimensions(positions),
    [positions]
  )

  return { positions, svgDims }
}
