<script setup lang="ts">
withDefaults(
  defineProps<{
    /** 底色：paper 纸黄、deep 深纸黄、ink 墨底 */
    tone?: 'paper' | 'deep' | 'ink'
    /** 内边距档位 */
    padding?: 'none' | 'sm' | 'md' | 'lg'
    /** 顶部分隔线，与上一区块接续 */
    divided?: boolean
    as?: string
  }>(),
  { tone: 'deep', padding: 'md', divided: false, as: 'div' },
)
</script>

<template>
  <component
    :is="as"
    class="paper-card"
    :class="[`paper-card--${tone}`, `paper-card--pad-${padding}`, { 'paper-card--divided': divided }]"
  >
    <header v-if="$slots.header" class="paper-card__header">
      <slot name="header" />
    </header>
    <div class="paper-card__body">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="paper-card__footer">
      <slot name="footer" />
    </footer>
  </component>
</template>

<style src="../styles/components/paper-card.css"></style>
