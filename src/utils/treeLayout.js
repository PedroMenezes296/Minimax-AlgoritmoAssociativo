// Two-pass Reingold-Tilford–inspired layout
// Returns Map<nodeId, {x, y}>

export const NODE_W = 84
export const NODE_H = 96
export const V_GAP  = 48

function getHGap(depth) {
  return Math.max(6, 16 - depth * 2)
}

// expandedNodes: Set<nodeId> — a node's children are visible only if the node is expanded
export function computeLayout(nodes, expandedNodes) {
  if (!nodes || nodes.length === 0) return new Map()

  const byId = new Map()
  for (const n of nodes) byId.set(n.id, n)

  const isVisible = (n) => n.depth === 0 || (expandedNodes && expandedNodes.has(n.parentId))

  const visible = nodes.filter(isVisible)
  if (visible.length === 0) return new Map()

  const root = visible[0]

  // Pass 1: compute subtree widths bottom-up
  const subtreeW = new Map()

  function calcWidth(nodeId) {
    const node = byId.get(nodeId)
    if (!node || !isVisible(node)) return 0

    const children = (node.childIds || []).filter(cid => {
      const c = byId.get(cid)
      return c && isVisible(c)
    })

    if (children.length === 0) {
      const w = NODE_W + getHGap(node.depth)
      subtreeW.set(nodeId, w)
      return w
    }

    const total = children.reduce((sum, cid) => sum + calcWidth(cid), 0)
    const w = Math.max(NODE_W + getHGap(node.depth), total)
    subtreeW.set(nodeId, w)
    return w
  }

  calcWidth(root.id)

  // Pass 2: assign positions top-down
  const positions = new Map()

  function assignPos(nodeId, leftX, y) {
    const node = byId.get(nodeId)
    if (!node || !isVisible(node)) return

    const sw = subtreeW.get(nodeId) || NODE_W
    const cx = leftX + sw / 2
    positions.set(nodeId, { x: cx, y })

    const children = (node.childIds || []).filter(cid => {
      const c = byId.get(cid)
      return c && isVisible(c)
    })

    let childLeft = leftX
    for (const cid of children) {
      const csw = subtreeW.get(cid) || NODE_W
      assignPos(cid, childLeft, y + NODE_H + V_GAP)
      childLeft += csw
    }
  }

  assignPos(root.id, 0, 0)

  return positions
}

export function getSvgDimensions(positions) {
  if (positions.size === 0) return { width: 800, height: 400 }
  let maxX = 0, maxY = 0
  for (const { x, y } of positions.values()) {
    if (x > maxX) maxX = x
    if (y > maxY) maxY = y
  }
  return {
    width:  maxX + NODE_W / 2 + 40,
    height: maxY + NODE_H + 40,
  }
}
