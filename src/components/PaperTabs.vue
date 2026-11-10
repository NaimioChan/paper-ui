<script setup lang="ts">
import { computed, useId } from 'vue'

export interface PaperTabItem {
  value: string
  label: string
  count?: number
  disabled?: boolean
}

const model = defineModel<string>()

const props = withDefaults(
  defineProps<{
    tabs: readonly PaperTabItem[]
    /** 变体：underline 下划标记，block 整块填充 */
    variant?: 'underline' | 'block'
    /** 尺寸 */
    size?: 'md' | 'sm'
  }>(),
  { variant: 'underline', size: 'md' },
)

const groupId = useId()
const active = computed(() => model.value ?? props.tabs.find((tab) => !tab.disabled)?.value ?? '')

function select(tab: PaperTabItem) {
  if (tab.disabled) return
  model.value = tab.value
}

function onKeydown(event: KeyboardEvent, index: number) {
  const enabled = props.tabs.map((tab, i) => ({ tab, i })).filter((entry) => !entry.tab.disabled)
  if (enabled.length === 0) return
  const currentPos = enabled.findIndex((entry) => entry.i === index)
  let targetPos = currentPos
  if (event.key === 'ArrowRight') targetPos = (currentPos + 1) % enabled.length
  else if (event.key === 'ArrowLeft') targetPos = (currentPos - 1 + enabled.length) % enabled.length
  else if (event.key === 'Home') targetPos = 0
  else if (event.key === 'End') targetPos = enabled.length - 1
  else return
  event.preventDefault()
  const target = enabled[targetPos]
  model.value = target.tab.value
  const el = globalThis.document?.getElementById(`${groupId}-tab-${target.tab.value}`)
  el?.focus()
}
</script>

<template>
  <div class="paper-tabs" :class="[`paper-tabs--${variant}`, `paper-tabs--${size}`]" role="tablist">
    <button
      v-for="(tab, index) in tabs"
      :id="`${groupId}-tab-${tab.value}`"
      :key="tab.value"
      class="paper-tabs__tab"
      :class="{ 'is-active': tab.value === active }"
      type="button"
      role="tab"
      :aria-selected="tab.value === active"
      :aria-controls="`${groupId}-panel-${tab.value}`"
      :tabindex="tab.value === active ? 0 : -1"
      :disabled="tab.disabled"
      @click="select(tab)"
      @keydown="onKeydown($event, index)"
    >
      <span class="paper-tabs__label">{{ tab.label }}</span>
      <span v-if="tab.count !== undefined" class="paper-tabs__count">{{ tab.count }}</span>
    </button>
  </div>
  <div
    v-if="$slots.default"
    class="paper-tabs__panel"
    :id="`${groupId}-panel-${active}`"
    role="tabpanel"
    :aria-labelledby="`${groupId}-tab-${active}`"
    tabindex="0"
  >
    <slot :active="active" />
  </div>
</template>

<style src="../styles/components/paper-tabs.css"></style>
