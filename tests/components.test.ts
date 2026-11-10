import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PaperButton from '../src/components/PaperButton.vue'
import PaperInput from '../src/components/PaperInput.vue'
import PaperSelect from '../src/components/PaperSelect.vue'
import PaperTag from '../src/components/PaperTag.vue'
import PaperTimeline from '../src/components/PaperTimeline.vue'
import PaperTabs from '../src/components/PaperTabs.vue'
import PaperTable from '../src/components/PaperTable.vue'
import PaperFigure from '../src/components/PaperFigure.vue'
import PaperDialog from '../src/components/PaperDialog.vue'
import PaperBadge from '../src/components/PaperBadge.vue'

describe('PaperButton', () => {
  it('默认是描边按钮', () => {
    const wrapper = mount(PaperButton, { slots: { default: '保存' } })
    expect(wrapper.classes()).toContain('paper-button--outline')
    expect(wrapper.text()).toBe('保存')
  })

  it('solid 变体加对应类名', () => {
    const wrapper = mount(PaperButton, { props: { variant: 'solid' } })
    expect(wrapper.classes()).toContain('paper-button--solid')
  })

  it('点击时抛出 click 事件', async () => {
    const wrapper = mount(PaperButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('loading 时禁用并带 aria-busy', () => {
    const wrapper = mount(PaperButton, { props: { loading: true } })
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.find('.paper-button__pulse').exists()).toBe(true)
  })

  it('block 撑满宽度', () => {
    const wrapper = mount(PaperButton, { props: { block: true } })
    expect(wrapper.classes()).toContain('paper-button--block')
  })
})

describe('PaperInput', () => {
  it('渲染 label 并关联到 input', () => {
    const wrapper = mount(PaperInput, { props: { label: '书名', modelValue: '' } })
    const label = wrapper.find('label')
    const input = wrapper.find('input')
    expect(label.text()).toBe('书名')
    expect(label.attributes('for')).toBe(input.attributes('id'))
  })

  it('错误态加上 invalid 类与 aria-invalid', () => {
    const wrapper = mount(PaperInput, { props: { error: '必填' } })
    expect(wrapper.find('.paper-field--invalid').exists()).toBe(true)
    expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')
    expect(wrapper.text()).toContain('必填')
  })

  it('有 rows 时渲染 textarea', () => {
    const wrapper = mount(PaperInput, { props: { rows: 4 } })
    expect(wrapper.find('textarea').exists()).toBe(true)
    expect(wrapper.find('input').exists()).toBe(false)
  })

  it('输入同步到 v-model', async () => {
    const wrapper = mount(PaperInput, { props: { modelValue: '' } })
    await wrapper.find('input').setValue('算法导论')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['算法导论'])
  })

  it('hint 与 error 同时存在时只显示 error', () => {
    const wrapper = mount(PaperInput, { props: { hint: '提示', error: '错误' } })
    const message = wrapper.find('.paper-field__message')
    expect(message.text()).toBe('错误')
    expect(message.classes()).toContain('paper-field__message--error')
  })
})

describe('PaperSelect', () => {
  const options = [
    { value: 1, label: '干净' },
    { value: 2, label: '有笔记' },
    { value: 3, label: '缺页', disabled: true },
  ]

  it('未打开时只渲染触发器，不渲染选项列表', () => {
    const wrapper = mount(PaperSelect, { props: { options } })
    expect(wrapper.find('[role="combobox"]').exists()).toBe(true)
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
  })

  it('触发器带 aria-haspopup 与收起状态', () => {
    const wrapper = mount(PaperSelect, { props: { options } })
    const trigger = wrapper.find('[role="combobox"]')
    expect(trigger.attributes('aria-haspopup')).toBe('listbox')
    expect(trigger.attributes('aria-expanded')).toBe('false')
  })

  it('点击展开后渲染全部选项', async () => {
    const wrapper = mount(PaperSelect, { props: { options } })
    await wrapper.find('[role="combobox"]').trigger('click')
    const items = wrapper.findAll('[role="option"]')
    expect(items).toHaveLength(3)
    expect(items[0].text()).toContain('干净')
  })

  it('未选中时显示占位文案', () => {
    const wrapper = mount(PaperSelect, { props: { options, placeholder: '请选择' } })
    expect(wrapper.find('.paper-select__value').text()).toBe('请选择')
  })

  it('选中项显示在触发器上', () => {
    const wrapper = mount(PaperSelect, { props: { options, modelValue: 2 } })
    expect(wrapper.find('.paper-select__value').text()).toBe('有笔记')
  })

  it('点击选项回传原始值并收起', async () => {
    const wrapper = mount(PaperSelect, { props: { options } })
    await wrapper.find('[role="combobox"]').trigger('click')
    await wrapper.findAll('[role="option"]')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([2])
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
  })

  it('禁用项不可选', async () => {
    const wrapper = mount(PaperSelect, { props: { options } })
    await wrapper.find('[role="combobox"]').trigger('click')
    await wrapper.findAll('[role="option"]')[2].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('禁用项带 aria-disabled', async () => {
    const wrapper = mount(PaperSelect, { props: { options } })
    await wrapper.find('[role="combobox"]').trigger('click')
    expect(wrapper.findAll('[role="option"]')[2].attributes('aria-disabled')).toBe('true')
  })

  it('方向键在可用项之间循环，跳过禁用项', async () => {
    const wrapper = mount(PaperSelect, { props: { options } })
    const trigger = wrapper.find('[role="combobox"]')
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.findAll('[role="option"]')[1].classes()).toContain('is-active')
    // 第二项再下移应回到首项，跳过末尾禁用项
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.findAll('[role="option"]')[0].classes()).toContain('is-active')
  })

  it('Enter 选中当前高亮项', async () => {
    const wrapper = mount(PaperSelect, { props: { options } })
    const trigger = wrapper.find('[role="combobox"]')
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await trigger.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([1])
  })

  it('Esc 收起面板', async () => {
    const wrapper = mount(PaperSelect, { props: { options } })
    const trigger = wrapper.find('[role="combobox"]')
    await trigger.trigger('click')
    expect(wrapper.find('[role="listbox"]').exists()).toBe(true)
    await trigger.trigger('keydown', { key: 'Escape' })
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
  })

  it('空选项数组时给出空态', async () => {
    const wrapper = mount(PaperSelect, { props: { options: [] } })
    await wrapper.find('[role="combobox"]').trigger('click')
    expect(wrapper.find('.paper-select__empty').text()).toBe('无选项')
  })

  it('错误态传给外壳', () => {
    const wrapper = mount(PaperSelect, { props: { options, error: '必选' } })
    expect(wrapper.find('.paper-field--invalid').exists()).toBe(true)
  })
})

describe('PaperTag', () => {
  it('默认 quiet 色调', () => {
    const wrapper = mount(PaperTag, { slots: { default: '干净' } })
    expect(wrapper.classes()).toContain('paper-tag--quiet')
    expect(wrapper.text()).toBe('干净')
  })

  it('tone 与 outline 组合成两个类', () => {
    const wrapper = mount(PaperTag, { props: { tone: 'strong', outline: true } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['paper-tag--strong', 'paper-tag--outline']))
  })
})

describe('PaperTimeline', () => {
  it('渲染节点数与当前标记', () => {
    const wrapper = mount(PaperTimeline, {
      props: {
        items: [
          { id: 'a', title: '张三 → 李四', price: '¥ 38' },
          { id: 'b', title: '在售', price: '¥ 30' },
        ],
      },
    })
    const nodes = wrapper.findAll('.paper-timeline__node')
    expect(nodes).toHaveLength(2)
    expect(nodes[1].classes()).toContain('paper-timeline__node--current')
    expect(nodes[1].attributes('aria-current')).toBe('step')
  })

  it('空数据显示空态文案', () => {
    const wrapper = mount(PaperTimeline, { props: { items: [] } })
    expect(wrapper.find('.paper-timeline').exists()).toBe(false)
    expect(wrapper.text()).toContain('暂无流转记录')
  })

  it('showPrice 关闭时不渲染价格列', () => {
    const wrapper = mount(PaperTimeline, {
      props: { items: [{ id: 'a', title: '在售', price: '¥ 30' }], showPrice: false },
    })
    expect(wrapper.find('.paper-timeline__price').exists()).toBe(false)
  })
})

describe('PaperTabs', () => {
  const tabs = [
    { value: 'onsale', label: '在售', count: 3 },
    { value: 'sold', label: '已售' },
    { value: 'off', label: '下架', disabled: true },
  ]

  it('默认选中第一个可用项', () => {
    const wrapper = mount(PaperTabs, { props: { tabs } })
    const buttons = wrapper.findAll('[role="tab"]')
    expect(buttons[0].attributes('aria-selected')).toBe('true')
    expect(buttons[0].attributes('tabindex')).toBe('0')
    expect(buttons[1].attributes('tabindex')).toBe('-1')
  })

  it('点击可用项切换', async () => {
    const wrapper = mount(PaperTabs, { props: { tabs } })
    const buttons = wrapper.findAll('[role="tab"]')
    await buttons[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['sold'])
  })

  it('禁用项不触发切换', async () => {
    const wrapper = mount(PaperTabs, { props: { tabs } })
    const buttons = wrapper.findAll('[role="tab"]')
    await buttons[2].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('右方向键从倒数第二项移到末项，跳过禁用项时不越界', async () => {
    const wrapper = mount(PaperTabs, { props: { tabs, modelValue: 'sold' } })
    const buttons = wrapper.findAll('[role="tab"]')
    await buttons[1].trigger('keydown', { key: 'ArrowRight' })
    // sold 是最后一个可用项，右移按循环回到首个可用项
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['onsale'])
  })

  it('左方向键从首项循环到最后一个可用项，跳过禁用项', async () => {
    const wrapper = mount(PaperTabs, { props: { tabs, modelValue: 'onsale' } })
    const buttons = wrapper.findAll('[role="tab"]')
    await buttons[0].trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['sold'])
  })

  it('count 渲染为数字列', () => {
    const wrapper = mount(PaperTabs, { props: { tabs } })
    expect(wrapper.find('.paper-tabs__count').text()).toBe('3')
  })
})

describe('PaperTable', () => {
  const columns = [
    { key: 'title', title: '书名' },
    { key: 'price', title: '价格', numeric: true },
  ]
  const rows = [
    { id: 1, title: '算法导论', price: '¥ 42' },
    { id: 2, title: '编译原理', price: '¥ 30' },
  ]

  it('渲染表头与行', () => {
    const wrapper = mount(PaperTable, { props: { columns, rows } })
    expect(wrapper.findAll('thead th')).toHaveLength(2)
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    expect(wrapper.text()).toContain('算法导论')
  })

  it('数值列右对齐并带等宽类', () => {
    const wrapper = mount(PaperTable, { props: { columns, rows } })
    const cells = wrapper.findAll('tbody tr')[0].findAll('td')
    expect(cells[1].classes()).toContain('paper-table__cell--numeric')
    expect(cells[1].classes()).toContain('paper-table__cell--end')
  })

  it('空数据渲染 emptyText', () => {
    const wrapper = mount(PaperTable, { props: { columns, rows: [], emptyText: '没有订单' } })
    expect(wrapper.find('.paper-table__empty').text()).toBe('没有订单')
  })

  it('loading 时渲染骨架行且不渲染数据', () => {
    const wrapper = mount(PaperTable, { props: { columns, rows, loading: true, loadingRows: 2 } })
    expect(wrapper.findAll('.paper-table__row--skeleton')).toHaveLength(2)
    expect(wrapper.text()).not.toContain('算法导论')
  })

  it('具名插槽覆盖单元格内容', () => {
    const wrapper = mount(PaperTable, {
      props: { columns, rows },
      slots: { title: '<template #title="{ row }"><b>{{ row.title }}</b></template>' },
    })
    expect(wrapper.find('tbody b').text()).toBe('算法导论')
  })
})

describe('PaperFigure', () => {
  it('无 src 时显示首字缺省态', () => {
    const wrapper = mount(PaperFigure, { props: { fallback: '算法导论' } })
    expect(wrapper.find('.paper-figure--empty').exists()).toBe(true)
    expect(wrapper.find('.paper-figure__letter').text()).toBe('算')
  })

  it('缺省字为空时回落到「书」', () => {
    const wrapper = mount(PaperFigure, {})
    expect(wrapper.find('.paper-figure__letter').text()).toBe('书')
  })

  it('有 src 时渲染 img 并把错误文字作为 alt', () => {
    const wrapper = mount(PaperFigure, { props: { src: '/uploads/covers/a.jpg', alt: '算法导论封面' } })
    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe('/uploads/covers/a.jpg')
    expect(img.attributes('alt')).toBe('算法导论封面')
  })

  it('图片加载失败时切回缺省态', async () => {
    const wrapper = mount(PaperFigure, { props: { src: '/missing.jpg', fallback: '编译原理' } })
    await wrapper.find('img').trigger('error')
    expect(wrapper.find('.paper-figure--empty').exists()).toBe(true)
  })

  it('round 形状加对应类', () => {
    const wrapper = mount(PaperFigure, { props: { shape: 'round', size: '96px' } })
    expect(wrapper.classes()).toContain('paper-figure--round')
  })
})

describe('PaperBadge', () => {
  it('未给 count 时为空', () => {
    const wrapper = mount(PaperBadge, { props: {} })
    expect(wrapper.text()).toBe('')
  })

  it('超过 max 显示 max+', () => {
    const wrapper = mount(PaperBadge, { props: { count: 120, max: 99 } })
    expect(wrapper.text()).toBe('99+')
  })

  it('dot 模式不带文字', () => {
    const wrapper = mount(PaperBadge, { props: { dot: true } })
    expect(wrapper.classes()).toContain('paper-badge--dot')
    expect(wrapper.text()).toBe('')
  })
})

describe('PaperDialog', () => {
  it('关闭时不渲染内容', () => {
    const wrapper = mount(PaperDialog, { props: { title: '确认', open: false } })
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('打开时渲染标题与插槽，并带 aria-modal', () => {
    const wrapper = mount(PaperDialog, {
      props: { title: '确认删除', open: true },
      slots: { default: '<p>不可撤销</p>' },
      attachTo: document.body,
    })
    const dialog = document.body.querySelector('[role="dialog"]') as HTMLElement
    expect(dialog).not.toBeNull()
    expect(dialog.getAttribute('aria-modal')).toBe('true')
    expect(dialog.textContent).toContain('确认删除')
    expect(dialog.textContent).toContain('不可撤销')
    wrapper.unmount()
  })

  it('确认与取消分别抛事件并关闭', async () => {
    const wrapper = mount(PaperDialog, {
      props: { title: '确认', open: true, confirmText: '删除', cancelText: '取消' },
      attachTo: document.body,
    })
    const buttons = Array.from(document.body.querySelectorAll<HTMLButtonElement>('.paper-dialog__btn'))
    buttons[0].click()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
    wrapper.unmount()
  })
})
