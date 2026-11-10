import { describe, expect, it } from 'vitest'
import { FOCUSABLE_SELECTOR, filterFocusable, nextFocusIndex, type FocusableLike } from '../src/lib/focus'

function fake(matches: boolean, disabled = false, hiddenIn = false): FocusableLike {
  return {
    matches: () => matches,
    hasAttribute: (name) => (name === 'disabled' ? disabled : false),
    closest: () => (hiddenIn ? ({} as Element) : null),
  }
}

describe('filterFocusable', () => {
  it('保留匹配选择器且未被禁用的元素', () => {
    const list = [fake(true), fake(true)]
    expect(filterFocusable(list)).toHaveLength(2)
  })

  it('剔除不匹配选择器的元素', () => {
    expect(filterFocusable([fake(false), fake(true)])).toHaveLength(1)
  })

  it('剔除带 disabled 属性的元素', () => {
    expect(filterFocusable([fake(true, true), fake(true)])).toHaveLength(1)
  })

  it('剔除位于 aria-hidden 容器内的元素', () => {
    expect(filterFocusable([fake(true, false, true), fake(true)])).toHaveLength(1)
  })

  it('空列表返回空列表', () => {
    expect(filterFocusable([])).toEqual([])
  })

  it('选择器覆盖常见控件', () => {
    expect(FOCUSABLE_SELECTOR).toContain('button:not([disabled])')
    expect(FOCUSABLE_SELECTOR).toContain('a[href]')
  })
})

describe('nextFocusIndex', () => {
  it('正向推进', () => {
    expect(nextFocusIndex(0, 3, false)).toBe(1)
  })

  it('正向到末尾回到起点', () => {
    expect(nextFocusIndex(2, 3, false)).toBe(0)
  })

  it('反向推进', () => {
    expect(nextFocusIndex(2, 3, true)).toBe(1)
  })

  it('反向到起点回到末尾', () => {
    expect(nextFocusIndex(0, 3, true)).toBe(2)
  })

  it('当前不在列表内时，正向取第一个、反向取最后一个', () => {
    expect(nextFocusIndex(-1, 3, false)).toBe(0)
    expect(nextFocusIndex(-1, 3, true)).toBe(2)
  })

  it('空列表返回 -1', () => {
    expect(nextFocusIndex(0, 0, false)).toBe(-1)
  })
})
