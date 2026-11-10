<script setup lang="ts">
withDefaults(
  defineProps<{
    /** 底色 */
    tone?: 'ink' | 'green' | 'orange' | 'gold' | 'paper' | 'deep'
    /** 内边距档位 */
    padding?: 'none' | 'sm' | 'md' | 'lg'
    /** 斜切右边 */
    slant?: boolean | 'reverse'
    /** 叠加纸噪 */
    noise?: boolean
    /** 顶部色条 */
    bar?: 'none' | 'orange' | 'green' | 'gold' | 'ink'
    as?: string
  }>(),
  { tone: 'ink', padding: 'md', slant: false, noise: false, bar: 'none', as: 'div' },
)
</script>

<template>
  <component
    :is="as"
    class="paper-slab"
    :class="[
      `paper-slab--${tone}`,
      `paper-slab--pad-${padding}`,
      `paper-slab--bar-${bar}`,
      {
        'paper-slab--slant': slant === true,
        'paper-slab--slant-reverse': slant === 'reverse',
        'paper-slab--noise': noise,
      },
    ]"
  >
    <slot />
  </component>
</template>

<style src="../styles/components/paper-slab.css"></style>
