<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import PaperField from './PaperField.vue'

export interface PaperSelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

const model = defineModel<string | number | null>({ default: null })

const props = withDefaults(
  defineProps<{
    /** 选项数组 */
    options?: PaperSelectOption[]
    /** 未选中时的占位文案 */
    placeholder?: string
    label?: string
    hint?: string
    error?: string
    note?: string
    required?: boolean
    id?: string
    name?: string
    disabled?: boolean
    /** 面板最大高度 */
    panelMaxHeight?: string
  }>(),
  { options: () => [], disabled: false, panelMaxHeight: '264px' },
)

const isPlaceholder = computed(() => props.placeholder !== undefined && model.value === null)

const open = ref(false)
const dropUp = ref(false)
const root = ref<HTMLElement | null>(null)
const listEl = ref<HTMLElement | null>(null)
const activeIndex = ref(-1)

const selectedLabel = computed(() => {
  const hit = props.options.find((option) => option.value === model.value)
  return hit ? hit.label : ''
})

const enabledIndexes = computed(() =>
  props.options.map((option, index) => ({ option, index })).filter((entry) => !entry.option.disabled).map((e) => e.index),
)

function close() {
  open.value = false
  activeIndex.value = -1
}

function toggle() {
  if (props.disabled) return
  if (open.value) close()
  else openPanel()
}

async function openPanel() {
  if (props.disabled) return
  // 触发器下方空间不足时向上展开，避免面板被视口裁切
  const rect = root.value?.getBoundingClientRect()
  if (rect) {
    const spaceBelow = globalThis.innerHeight - rect.bottom
    const panelHeight = Math.min(Number.parseInt(props.panelMaxHeight, 10) || 264, 264)
    dropUp.value = spaceBelow < panelHeight + 16 && rect.top > spaceBelow
  }
  open.value = true
  const current = props.options.findIndex((option) => option.value === model.value && !option.disabled)
  activeIndex.value = current >= 0 ? current : (enabledIndexes.value[0] ?? -1)
  await nextTick()
  scrollActiveIntoView()
}

function scrollActiveIntoView() {
  const list = listEl.value
  if (!list || activeIndex.value < 0) return
  const item = list.querySelector<HTMLElement>(`[data-index="${activeIndex.value}"]`)
  item?.scrollIntoView?.({ block: 'nearest' })
}

function select(index: number) {
  const option = props.options[index]
  if (!option || option.disabled) return
  model.value = option.value
  close()
}

function move(delta: number) {
  const list = enabledIndexes.value
  if (list.length === 0) return
  const pos = list.indexOf(activeIndex.value)
  const nextPos = pos === -1
    ? (delta > 0 ? 0 : list.length - 1)
    : (pos + delta + list.length) % list.length
  activeIndex.value = list[nextPos]
  void nextTick(scrollActiveIntoView)
}

function onKeydown(event: KeyboardEvent) {
  if (props.disabled) return
  if (!open.value) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      void openPanel()
    }
    return
  }
  switch (event.key) {
    case 'Escape':
      event.preventDefault()
      close()
      break
    case 'ArrowDown':
      event.preventDefault()
      move(1)
      break
    case 'ArrowUp':
      event.preventDefault()
      move(-1)
      break
    case 'Home':
      event.preventDefault()
      activeIndex.value = enabledIndexes.value[0] ?? -1
      void nextTick(scrollActiveIntoView)
      break
    case 'End':
      event.preventDefault()
      activeIndex.value = enabledIndexes.value.at(-1) ?? -1
      void nextTick(scrollActiveIntoView)
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      select(activeIndex.value)
      break
    case 'Tab':
      close()
      break
  }
}

function onDocumentPointerDown(event: PointerEvent) {
  if (!open.value) return
  if (root.value && !root.value.contains(event.target as Node)) close()
}

watch(open, (isOpen) => {
  if (globalThis.document) {
    if (isOpen) globalThis.document.addEventListener('pointerdown', onDocumentPointerDown, true)
    else globalThis.document.removeEventListener('pointerdown', onDocumentPointerDown, true)
  }
})

onBeforeUnmount(() => {
  globalThis.document?.removeEventListener('pointerdown', onDocumentPointerDown, true)
})

const triggerId = computed(() => props.id)
</script>

<template>
  <PaperField :label="label" :hint="hint" :error="error" :note="note" :required="required" :id="triggerId">
    <template #default="{ id: fieldId, messageId, invalid, required: isRequired }">
      <div
        ref="root"
        class="paper-select"
        :class="{
          'paper-select--open': open,
          'paper-select--drop-up': dropUp,
          'paper-select--placeholder': isPlaceholder,
          'paper-select--disabled': disabled,
        }"
      >
        <input v-if="name" type="hidden" :name="name" :value="model ?? ''" />
        <button
          :id="fieldId"
          class="paper-control paper-select__trigger"
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          :aria-expanded="open"
          :aria-controls="`${fieldId}-listbox`"
          :aria-invalid="invalid || undefined"
          :aria-describedby="messageId"
          :aria-required="isRequired || undefined"
          :disabled="disabled"
          @click="toggle"
          @keydown="onKeydown"
        >
          <span class="paper-select__value">{{ selectedLabel || placeholder || '' }}</span>
          <span class="paper-select__mark" aria-hidden="true"></span>
        </button>

        <div v-if="open" class="paper-select__panel" :style="{ maxHeight: panelMaxHeight }">
          <ul
            :id="`${fieldId}-listbox`"
            ref="listEl"
            class="paper-select__list"
            role="listbox"
            :aria-labelledby="fieldId"
          >
            <li
              v-for="(option, index) in options"
              :key="String(option.value)"
              class="paper-select__option"
              :class="{
                'is-active': index === activeIndex,
                'is-selected': option.value === model,
                'is-disabled': option.disabled,
              }"
              :data-index="index"
              role="option"
              :aria-selected="option.value === model"
              :aria-disabled="option.disabled || undefined"
              @click="select(index)"
              @pointermove="!option.disabled && (activeIndex = index)"
            >
              <span class="paper-select__option-label">{{ option.label }}</span>
              <span v-if="option.value === model" class="paper-select__tick" aria-hidden="true"></span>
            </li>
            <li v-if="options.length === 0" class="paper-select__empty">无选项</li>
          </ul>
        </div>
      </div>
    </template>
  </PaperField>
</template>

<style src="../styles/components/paper-select.css"></style>
