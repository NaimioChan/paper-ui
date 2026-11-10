/** 可获得焦点的元素选择器，用于弹窗内的焦点循环。 */
export const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export interface FocusableLike {
  matches(selector: string): boolean
  hasAttribute(name: string): boolean
  closest(selector: string): Element | null
}

/**
 * 从候选元素里筛出真正可聚焦的：排除 disabled、隐藏、以及 aria-hidden 容器内的。
 * 与 DOM 解耦，便于单测。
 */
export function filterFocusable<T extends FocusableLike>(candidates: readonly T[]): T[] {
  return candidates.filter((el) => {
    if (!el.matches(FOCUSABLE_SELECTOR)) return false
    if (el.hasAttribute('disabled')) return false
    const hiddenAncestor = el.closest('[aria-hidden="true"], [hidden], [inert]')
    return hiddenAncestor === null
  })
}

/**
 * Tab 键在弹窗内的下一个焦点下标。
 * shift 为真时反向；到达边界时回到另一端；空列表返回 -1。
 */
export function nextFocusIndex(current: number, total: number, shift: boolean): number {
  if (total <= 0) return -1
  if (current < 0) return shift ? total - 1 : 0
  const delta = shift ? -1 : 1
  return (current + delta + total) % total
}

/** 禁用页面滚动时的内联样式值，恢复时用保存的原值。 */
export function lockScrollStyle(): { overflow: string; paddingRight: string } {
  const root = globalThis.document?.documentElement
  const scrollbar = globalThis.innerWidth - (root?.clientWidth ?? 0)
  return {
    overflow: 'hidden',
    paddingRight: scrollbar > 0 ? `${scrollbar}px` : '',
  }
}
