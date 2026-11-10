<script setup lang="ts">
withDefaults(
  defineProps<{
    /** 宽度，接受任意 CSS 长度 */
    width?: string
    height?: string
    /** 文本行版：多行时最后一行为半宽 */
    lines?: number
  }>(),
  { width: '100%', height: '1em', lines: 0 },
)
</script>

<template>
  <div v-if="lines > 0" class="paper-skeleton-lines" :aria-busy="true" aria-live="polite">
    <span
      v-for="line in lines"
      :key="line"
      class="paper-skeleton"
      :style="{ width: line === lines && lines > 1 ? '60%' : width, height }"
    ></span>
  </div>
  <span v-else class="paper-skeleton" :style="{ width, height }" :aria-busy="true" aria-live="polite"></span>
</template>

<style src="../styles/components/paper-skeleton.css"></style>
