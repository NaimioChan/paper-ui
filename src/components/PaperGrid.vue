<script setup lang="ts">
withDefaults(
  defineProps<{
    /** 列数，默认十二列 */
    columns?: number
    /** 列间距，默认 --grid-gap */
    gap?: string
  }>(),
  { columns: 12, gap: 'var(--grid-gap)' },
)
</script>

<template>
  <div class="paper-grid" :style="{ '--grid-cols': String(columns), '--grid-row-gap': gap }">
    <slot />
  </div>
</template>

<style src="../styles/components/paper-grid.css"></style>
