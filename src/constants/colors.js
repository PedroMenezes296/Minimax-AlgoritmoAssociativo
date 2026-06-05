export const COLORS = {
  bgPrimary:   '#0A0A0F',
  bgSecondary: '#12121A',
  bgCard:      '#1A1A28',
  border:      '#2A2A45',
  textPrimary: '#E8E8F0',
  textMuted:   '#6B6B9A',
  accentMax:   '#00BFFF',
  accentMin:   '#FF6B35',
  winAi:       '#00FF88',
  winHuman:    '#FF3355',
  draw:        '#FFD700',
  pruned:      '#2A2A35',
  prunedText:  '#3A3A55',
  pathChosen:  '#FFFFFF',
}

export function getNodeColor(node) {
  if (node.isPruned) return COLORS.pruned
  if (node.isLeaf) {
    if (node.value === 1)  return COLORS.winAi
    if (node.value === -1) return COLORS.winHuman
    return COLORS.draw
  }
  return node.type === 'MAX' ? COLORS.accentMax : COLORS.accentMin
}
