<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { filterFocusable, FOCUSABLE_SELECTOR, nextFocusIndex } from '../lib/focus'

const open = defineModel<boolean>('open', { default: false })

const props = withDefaults(
  defineProps<{
    title: string
    /** 副标题或说明，可选 */
    description?: string
    /** 弹窗宽度档位 */
    size?: 'sm' | 'md' | 'lg'
    /** 点击遮罩是否关闭 */
    dismissible?: boolean
    /** 底部操作区按钮文案；留空则不渲染操作区 */
    confirmText?: string
    cancelText?: string
    /** 确认按钮进入加载态 */
    loading?: boolean
  }>(),
  { size: 'md', dismissible: true, loading: false },
)

const emit = defineEmits<{ confirm: []; cancel: [] }>()

const panel = ref<HTMLElement | null>(null)
const restoreTarget = ref<HTMLElement | null>(null)
let previousOverflow = ''
let previousPadding = ''

function restoreScroll() {
  const root = globalThis.document?.documentElement
  if (!root) return
  root.style.overflow = previousOverflow
  root.style.paddingRight = previousPadding
}

function lockScroll() {
  const root = globalThis.document?.documentElement
  if (!root) return
  previousOverflow = root.style.overflow
  previousPadding = root.style.paddingRight
  const scrollbar = globalThis.innerWidth - root.clientWidth
  root.style.overflow = 'hidden'
  if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`
}

// 焦点落在面板本身而非第一个控件：避免误触关闭按钮，Tab 会先进入面板内首个控件。
async function focusPanel() {
  await nextTick()
  panel.value?.focus()
}

watch(
  () => open.value,
  (isOpen) => {
    if (isOpen) {
      restoreTarget.value = globalThis.document?.activeElement as HTMLElement | null
      lockScroll()
      void focusPanel()
    } else {
      restoreScroll()
      restoreTarget.value?.focus?.()
      restoreTarget.value = null
    }
  },
)

function close() {
  open.value = false
}

function cancel() {
  emit('cancel')
  close()
}

function confirm() {
  emit('confirm')
}

function onOverlayClick() {
  if (props.dismissible) close()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.stopPropagation()
    if (props.dismissible) close()
    return
  }
  if (event.key !== 'Tab' || !panel.value) return
  const candidates = filterFocusable(Array.from(panel.value.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)))
  if (candidates.length === 0) {
    event.preventDefault()
    panel.value.focus()
    return
  }
  const active = globalThis.document?.activeElement as HTMLElement | null
  const currentIndex = active ? candidates.indexOf(active) : -1
  const goingBackwards = event.shiftKey
  const atEdge =
    (goingBackwards && currentIndex <= 0) ||
    (!goingBackwards && currentIndex === candidates.length - 1)
  if (!atEdge) return
  event.preventDefault()
  const target = candidates[nextFocusIndex(currentIndex, candidates.length, goingBackwards)]
  target?.focus()
}

onBeforeUnmount(restoreScroll)

const titleId = computed(() => `paper-dialog-title-${Math.random().toString(36).slice(2, 8)}`)
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="paper-dialog"
      role="presentation"
      @keydown="onKeydown"
    >
      <div class="paper-dialog__overlay" @click.self="onOverlayClick"></div>
      <div
        ref="panel"
        class="paper-dialog__panel"
        :class="`paper-dialog__panel--${size}`"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        tabindex="-1"
      >
        <header class="paper-dialog__head">
          <div class="paper-dialog__heading">
            <h2 :id="titleId" class="paper-dialog__title">{{ title }}</h2>
            <p v-if="description" class="paper-dialog__description">{{ description }}</p>
          </div>
          <button class="paper-dialog__close" type="button" aria-label="关闭" @click="close">×</button>
        </header>
        <div class="paper-dialog__body">
          <slot />
        </div>
        <footer v-if="confirmText || cancelText || $slots.footer" class="paper-dialog__foot">
          <slot name="footer">
            <button v-if="cancelText" class="paper-dialog__btn" type="button" @click="cancel">{{ cancelText }}</button>
            <button
              v-if="confirmText"
              class="paper-dialog__btn paper-dialog__btn--solid"
              type="button"
              :disabled="loading"
              :aria-busy="loading || undefined"
              @click="confirm"
            >
              {{ confirmText }}
            </button>
          </slot>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style src="../styles/components/paper-dialog.css"></style>
