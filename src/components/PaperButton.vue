<script setup lang="ts">
withDefaults(
  defineProps<{
    /** solid 墨底纸黄字；outline 描边；ghost 无边框，用于行内次级动作 */
    variant?: 'solid' | 'outline' | 'ghost'
    size?: 'md' | 'sm'
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    /** 加载中：禁用交互并在左侧显示方块脉冲 */
    loading?: boolean
    /** 撑满父容器宽度 */
    block?: boolean
  }>(),
  { variant: 'outline', size: 'md', type: 'button', disabled: false, loading: false, block: false },
)

const emit = defineEmits<{ click: [event: MouseEvent] }>()

function onClick(event: MouseEvent) {
  emit('click', event)
}
</script>

<template>
  <button
    class="paper-button"
    :class="[`paper-button--${variant}`, `paper-button--${size}`, { 'paper-button--block': block, 'is-loading': loading }]"
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
    @click="onClick"
  >
    <span v-if="loading" class="paper-button__pulse" aria-hidden="true"></span>
    <slot />
  </button>
</template>

<style src="../styles/components/paper-button.css"></style>
