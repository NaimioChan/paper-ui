<script setup lang="ts">
withDefaults(
  defineProps<{
    /** 数值；超过 max 显示 max+ */
    count?: number
    max?: number
    /** 无数字时的小实心方块，用作状态点 */
    dot?: boolean
    tone?: 'ink' | 'orange'
    /** 数值可读文本，供屏幕阅读器使用 */
    srLabel?: string
  }>(),
  { max: 99, dot: false, tone: 'ink' },
)
</script>

<template>
  <span
    class="paper-badge"
    :class="[`paper-badge--${tone}`, { 'paper-badge--dot': dot }]"
    :aria-label="srLabel"
  >
    <template v-if="!dot">{{ count !== undefined && count > max ? `${max}+` : (count ?? '') }}</template>
  </span>
</template>

<style src="../styles/components/paper-badge.css"></style>
