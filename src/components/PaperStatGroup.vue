<script setup lang="ts">
withDefaults(
  defineProps<{
    /** 一行几格，桌面宽度下生效 */
    columns?: number
    /** 采用墨底纸黄字的反色块 */
    inverse?: boolean
  }>(),
  { columns: 4, inverse: true },
)

export interface PaperStatItem {
  value: string | number
  label: string
  unit?: string
  mono?: boolean
}
</script>

<template>
  <div
    class="paper-stat-group"
    :class="{ 'paper-stat-group--inverse': inverse }"
    :style="{ '--stat-cols': String(columns) }"
  >
    <slot />
  </div>
</template>

<style src="../styles/components/paper-stat.css"></style>
