import { readonly, ref } from 'vue'

export type PaperToastTone = 'ink' | 'orange' | 'green' | 'gold'

export interface PaperToastItem {
  id: number
  message: string
  tone: PaperToastTone
  /** 自动关闭时长，毫秒；0 表示不自动关闭 */
  duration: number
}

let sequence = 0
const items = ref<PaperToastItem[]>([])

/** 同时可见的提示条数上限。 */
const MAX_VISIBLE = 3

function push(message: string, tone: PaperToastTone, duration: number): number {
  const id = ++sequence
  items.value = [...items.value, { id, message, tone, duration }].slice(-MAX_VISIBLE)
  if (duration > 0) {
    setTimeout(() => dismiss(id), duration)
  }
  return id
}

function dismiss(id: number): void {
  items.value = items.value.filter((item) => item.id !== id)
}

/**
 * 轻提示队列。任意组件里调用 show()，页面根部放一个 PaperToast 即可渲染。
 * 队列是模块级单例，同一应用共享。
 */
export function usePaperToast() {
  return {
    items: readonly(items),
    show: (message: string, options: { tone?: PaperToastTone; duration?: number } = {}) =>
      push(message, options.tone ?? 'ink', options.duration ?? 2600),
    dismiss,
    clear: () => {
      items.value = []
    },
  }
}

/** 仅测试用：重置序号与队列。 */
export function __resetPaperToast(): void {
  sequence = 0
  items.value = []
}
