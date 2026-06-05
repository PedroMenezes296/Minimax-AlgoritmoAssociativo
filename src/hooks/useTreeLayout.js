import { useMemo } from 'react'
import { computeLayout, getSvgDimensions } from '../utils/treeLayout.js'

export function useTreeLayout(nodes, renderDepth) {
  const positions = useMemo(
    () => computeLayout(nodes, renderDepth),
    [nodes, renderDepth]
  )

  const svgDims = useMemo(
    () => getSvgDimensions(positions),
    [positions]
  )

  return { positions, svgDims }
}
