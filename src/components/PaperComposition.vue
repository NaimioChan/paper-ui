<script setup lang="ts">
withDefaults(
  defineProps<{
    /** 构图模式：offset 错位双栏、diagonal 斜切分栏、stack 堆叠带色条 */
    layout?: 'offset' | 'diagonal' | 'stack'
    /** 左右两栏的比例，写作 CSS grid 片段 */
    ratio?: string
    /** 分隔用的色条粗细档位 */
    divider?: 'none' | 'hair' | 'thin' | 'mid' | 'thick'
    /** 色条颜色 */
    dividerTone?: 'ink' | 'orange' | 'green' | 'gold'
  }>(),
  { layout: 'offset', ratio: '1.4fr 1fr', divider: 'mid', dividerTone: 'orange' },
)
</script>

<template>
  <div
    class="paper-composition"
    :class="[`paper-composition--${layout}`]"
    :style="{ '--comp-ratio': ratio }"
  >
    <slot />
    <span
      v-if="divider !== 'none'"
      class="paper-composition__divider"
      :class="[`paper-composition__divider--${divider}`, `paper-composition__divider--${dividerTone}`]"
      aria-hidden="true"
    ></span>
  </div>
</template>

<style src="../styles/components/paper-composition.css"></style>
