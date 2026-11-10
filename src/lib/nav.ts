/** 导航链接。href 缺省时渲染为按钮，交给调用方处理路由。 */
export interface PaperNavLink {
  id: string
  label: string
  href?: string
  badge?: number | string
  disabled?: boolean
}

/** 侧栏分组。collapsible 为真时标题可折叠。 */
export interface PaperNavGroup {
  id: string
  label?: string
  items: PaperNavLink[]
  collapsible?: boolean
  /** 折叠组的初始展开状态，缺省为展开 */
  defaultOpen?: boolean
}

export interface PaperNavEntry {
  groupId: string
  groupIndex: number
  link: PaperNavLink
  linkIndex: number
}

/**
 * 展平分组为顺序叶子项，跳过禁用链接。
 * 供键盘导航与顺序遍历使用。
 */
export function flattenNav(groups: readonly PaperNavGroup[]): PaperNavEntry[] {
  const entries: PaperNavEntry[] = []
  groups.forEach((group, groupIndex) => {
    group.items.forEach((link, linkIndex) => {
      if (link.disabled) return
      entries.push({ groupId: group.id, groupIndex, link, linkIndex })
    })
  })
  return entries
}

/** 只保留展开分组内的项。openState 缺省的组视为展开。 */
export function visibleNav(
  groups: readonly PaperNavGroup[],
  openState: Readonly<Record<string, boolean>>,
): PaperNavEntry[] {
  const open = groups.filter((group) => openState[group.id] !== false)
  return flattenNav(open)
}

/** 包含当前项的可见分组 id；无匹配返回空数组。 */
export function activeGroupIds(groups: readonly PaperNavGroup[], activeId: string | null | undefined): string[] {
  if (!activeId) return []
  return groups.filter((group) => group.items.some((link) => link.id === activeId)).map((group) => group.id)
}

/**
 * 分组初始展开状态。
 * 折叠组的默认值为 defaultOpen ?? true；非折叠组恒为展开。
 */
export function initialOpenState(groups: readonly PaperNavGroup[]): Record<string, boolean> {
  const state: Record<string, boolean> = {}
  for (const group of groups) {
    state[group.id] = group.collapsible ? (group.defaultOpen ?? true) : true
  }
  return state
}

/**
 * 在 length 个可用项之间按 delta 循环取下标。
 * current 为 -1（尚无焦点）时，前进取首项、后退取末项。
 */
export function nextNavIndex(current: number, length: number, delta: number): number {
  if (length <= 0) return -1
  if (delta === 0) return Math.min(Math.max(current, 0), length - 1)
  if (current < 0) return delta > 0 ? 0 : length - 1
  return (((current + delta) % length) + length) % length
}

/** 当前项所在分组若被收起，需要展开它；返回需要强制展开的分组 id 列表。 */
export function groupsToReveal(
  groups: readonly PaperNavGroup[],
  openState: Readonly<Record<string, boolean>>,
  activeId: string | null | undefined,
): string[] {
  return activeGroupIds(groups, activeId).filter((id) => openState[id] === false)
}
