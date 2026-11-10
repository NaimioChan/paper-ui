<script setup lang="ts">
withDefaults(
  defineProps<{
    /** 桌面端占几列 */
    span?: number
    /** 640px 以下占几列，缺省满 12 列（移动端默认单列堆叠） */
    spanSm?: number
    /** 起始列，用于留白排版 */
    start?: number
  }>(),
  { span: 12, spanSm: 12 },
)
</script>

<template>
  <div
    class="paper-cell"
    :style="{
      '--cell-span': String(span),
      '--cell-span-sm': String(spanSm),
      '--cell-start': start ? String(start) : 'auto',
    }"
  >
    <slot />
  </div>
</template>

<style src="../styles/components/paper-grid.css"></style>
