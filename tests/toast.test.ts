import { beforeEach, describe, expect, it, vi } from 'vitest'
import { __resetPaperToast, usePaperToast } from '../src/lib/toast'

describe('usePaperToast', () => {
  beforeEach(() => {
    __resetPaperToast()
    vi.useRealTimers()
  })

  it('show 追加一条并返回自增 id', () => {
    const toast = usePaperToast()
    const first = toast.show('已保存')
    const second = toast.show('已删除')
    expect(toast.items.value.map((item) => item.message)).toEqual(['已保存', '已删除'])
    expect(second).toBeGreaterThan(first)
  })

  it('默认语气为 ink，默认时长 2600ms', () => {
    const toast = usePaperToast()
    toast.show('提示')
    expect(toast.items.value[0].tone).toBe('ink')
    expect(toast.items.value[0].duration).toBe(2600)
  })

  it('可指定语气与时长', () => {
    const toast = usePaperToast()
    toast.show('失败', { tone: 'orange', duration: 5000 })
    expect(toast.items.value[0].tone).toBe('orange')
    expect(toast.items.value[0].duration).toBe(5000)
  })

  it('超过三条时丢弃最早的', () => {
    const toast = usePaperToast()
    toast.show('1', { duration: 0 })
    toast.show('2', { duration: 0 })
    toast.show('3', { duration: 0 })
    toast.show('4', { duration: 0 })
    expect(toast.items.value.map((item) => item.message)).toEqual(['2', '3', '4'])
  })

  it('duration 为 0 时不自动关闭', () => {
    vi.useFakeTimers()
    const toast = usePaperToast()
    toast.show('常驻', { duration: 0 })
    vi.advanceTimersByTime(10000)
    expect(toast.items.value).toHaveLength(1)
  })

  it('到时自动移除', () => {
    vi.useFakeTimers()
    const toast = usePaperToast()
    toast.show('短暂', { duration: 1000 })
    expect(toast.items.value).toHaveLength(1)
    vi.advanceTimersByTime(1000)
    expect(toast.items.value).toHaveLength(0)
  })

  it('dismiss 按 id 移除，clear 清空', () => {
    const toast = usePaperToast()
    const id = toast.show('甲', { duration: 0 })
    toast.show('乙', { duration: 0 })
    toast.dismiss(id)
    expect(toast.items.value.map((item) => item.message)).toEqual(['乙'])
    toast.clear()
    expect(toast.items.value).toHaveLength(0)
  })

  it('多次调用共享同一队列', () => {
    const a = usePaperToast()
    const b = usePaperToast()
    a.show('共享', { duration: 0 })
    expect(b.items.value).toHaveLength(1)
  })
})
