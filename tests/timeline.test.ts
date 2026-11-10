import { describe, expect, it } from 'vitest'
import { resolveTimeline, type PaperTimelineItem } from '../src/lib/timeline'

const base: PaperTimelineItem[] = [
  { id: 'a', when: '2024 秋', title: '张三 → 李四', price: '¥ 38' },
  { id: 'b', when: '2025 春', title: '李四 → 王五', price: '¥ 30' },
  { id: 'c', when: '2025 秋', title: '王五 在售', price: '¥ 26' },
]

describe('resolveTimeline', () => {
  it('空数组返回空数组', () => {
    expect(resolveTimeline([])).toEqual([])
  })

  it('无显式标记时最后一项为当前', () => {
    const nodes = resolveTimeline(base)
    expect(nodes.map((n) => n.isCurrent)).toEqual([false, false, true])
  })

  it('显式 current 优先于末项默认', () => {
    const nodes = resolveTimeline([base[0], { ...base[1], current: true }, base[2]])
    expect(nodes.map((n) => n.isCurrent)).toEqual([false, true, false])
  })

  it('多个标记时取第一个', () => {
    const nodes = resolveTimeline([
      { ...base[0], current: true },
      { ...base[1], current: true },
    ])
    expect(nodes.map((n) => n.isCurrent)).toEqual([true, false])
  })

  it('首项上方无连线，末项下方无连线', () => {
    const nodes = resolveTimeline(base)
    expect(nodes[0].lineAbove).toBe(false)
    expect(nodes[0].lineBelow).toBe(true)
    expect(nodes[2].lineBelow).toBe(false)
  })

  it('单项时上下都不连线', () => {
    const nodes = resolveTimeline([base[0]])
    expect(nodes[0].lineAbove).toBe(false)
    expect(nodes[0].lineBelow).toBe(false)
    expect(nodes[0].isCurrent).toBe(true)
  })

  it('保留原字段并附带 index', () => {
    const nodes = resolveTimeline(base)
    expect(nodes[1].title).toBe('李四 → 王五')
    expect(nodes[1].price).toBe('¥ 30')
    expect(nodes.map((n) => n.index)).toEqual([0, 1, 2])
  })

  it('不修改入参', () => {
    const input = [...base]
    resolveTimeline(input)
    expect(input).toEqual(base)
  })
})
