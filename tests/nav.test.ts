import { describe, expect, it } from 'vitest'
import {
  activeGroupIds,
  flattenNav,
  groupsToReveal,
  initialOpenState,
  nextNavIndex,
  visibleNav,
  type PaperNavGroup,
} from '../src/lib/nav'

const groups: PaperNavGroup[] = [
  {
    id: 'main',
    label: '主导航',
    items: [
      { id: 'home', label: '首页' },
      { id: 'books', label: '书目', badge: 3 },
    ],
  },
  {
    id: 'admin',
    label: '管理',
    collapsible: true,
    items: [
      { id: 'orders', label: '订单' },
      { id: 'users', label: '用户', disabled: true },
      { id: 'settings', label: '设置' },
    ],
  },
]

describe('flattenNav', () => {
  it('按分组顺序展平并跳过禁用项', () => {
    const flat = flattenNav(groups)
    expect(flat.map((e) => e.link.id)).toEqual(['home', 'books', 'orders', 'settings'])
  })

  it('保留分组与链接下标', () => {
    const flat = flattenNav(groups)
    const settings = flat.find((e) => e.link.id === 'settings')
    expect(settings?.groupId).toBe('admin')
    expect(settings?.groupIndex).toBe(1)
    expect(settings?.linkIndex).toBe(2)
  })

  it('空分组返回空数组', () => {
    expect(flattenNav([])).toEqual([])
  })

  it('全是禁用项时返回空数组', () => {
    const flat = flattenNav([{ id: 'g', items: [{ id: 'a', label: 'A', disabled: true }] }])
    expect(flat).toEqual([])
  })
})

describe('visibleNav', () => {
  it('收起的分组不出现在结果里', () => {
    const visible = visibleNav(groups, { admin: false })
    expect(visible.map((e) => e.link.id)).toEqual(['home', 'books'])
  })

  it('未出现在 openState 的分组视为展开', () => {
    const visible = visibleNav(groups, {})
    expect(visible).toHaveLength(4)
  })

  it('全部收起时返回空数组', () => {
    expect(visibleNav(groups, { main: false, admin: false })).toEqual([])
  })
})

describe('activeGroupIds', () => {
  it('返回包含当前项的分组 id', () => {
    expect(activeGroupIds(groups, 'orders')).toEqual(['admin'])
  })

  it('未匹配或为空时返回空数组', () => {
    expect(activeGroupIds(groups, 'nope')).toEqual([])
    expect(activeGroupIds(groups, null)).toEqual([])
    expect(activeGroupIds(groups, undefined)).toEqual([])
  })

  it('禁用项仍可被识别为当前项所在分组', () => {
    expect(activeGroupIds(groups, 'users')).toEqual(['admin'])
  })
})

describe('initialOpenState', () => {
  it('折叠组按 defaultOpen 初始化，缺省为展开', () => {
    expect(initialOpenState(groups)).toEqual({ main: true, admin: true })
  })

  it('defaultOpen 为 false 时初始收起', () => {
    const g: PaperNavGroup[] = [{ id: 'x', collapsible: true, defaultOpen: false, items: [] }]
    expect(initialOpenState(g)).toEqual({ x: false })
  })

  it('非折叠组恒为展开，忽略 defaultOpen', () => {
    const g: PaperNavGroup[] = [{ id: 'y', defaultOpen: false, items: [] }]
    expect(initialOpenState(g)).toEqual({ y: true })
  })
})

describe('nextNavIndex', () => {
  it('正向推进', () => {
    expect(nextNavIndex(0, 3, 1)).toBe(1)
  })

  it('到末尾循环回起点', () => {
    expect(nextNavIndex(2, 3, 1)).toBe(0)
  })

  it('反向推进', () => {
    expect(nextNavIndex(1, 3, -1)).toBe(0)
  })

  it('到起点循环到末尾', () => {
    expect(nextNavIndex(0, 3, -1)).toBe(2)
  })

  it('无焦点时前进取首项、后退取末项', () => {
    expect(nextNavIndex(-1, 3, 1)).toBe(0)
    expect(nextNavIndex(-1, 3, -1)).toBe(2)
  })

  it('空列表返回 -1', () => {
    expect(nextNavIndex(0, 0, 1)).toBe(-1)
  })

  it('delta 为 0 时夹取当前值', () => {
    expect(nextNavIndex(5, 3, 0)).toBe(2)
    expect(nextNavIndex(-2, 3, 0)).toBe(0)
  })
})

describe('groupsToReveal', () => {
  it('当前项所在分组被收起时返回该 id', () => {
    expect(groupsToReveal(groups, { admin: false }, 'orders')).toEqual(['admin'])
  })

  it('分组已展开时返回空数组', () => {
    expect(groupsToReveal(groups, { admin: true }, 'orders')).toEqual([])
  })

  it('当前项不存在时返回空数组', () => {
    expect(groupsToReveal(groups, { admin: false }, 'nope')).toEqual([])
  })
})
