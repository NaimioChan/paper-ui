<script setup lang="ts">
withDefaults(
  defineProps<{
    /** 色调：quiet 浅色、mid 纸绿、strong 墨底 */
    tone?: 'quiet' | 'mid' | 'strong'
    /** 加粗边框版本，用于需要更分明层级的位置 */
    outline?: boolean
    as?: string
  }>(),
  { tone: 'quiet', outline: false, as: 'span' },
)
</script>

<template>
  <component :is="as" class="paper-tag" :class="[`paper-tag--${tone}`, { 'paper-tag--outline': outline }]">
    <slot />
  </component>
</template>

<style src="../styles/components/paper-tag.css"></style>
