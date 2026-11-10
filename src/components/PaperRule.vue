<script setup lang="ts">
withDefaults(
  defineProps<{
    /** 竖向分隔线，用于行内分栏 */
    vertical?: boolean
    /** 粗细：hair 一像素，bold 两像素 */
    weight?: 'hair' | 'bold'
    /** 上下留白，取 --space-N 的档位 */
    space?: number
  }>(),
  { vertical: false, weight: 'hair' },
)
</script>

<template>
  <hr
    class="paper-rule"
    :class="[`paper-rule--${weight}`, { 'paper-rule--vertical': vertical }]"
    :style="space === undefined ? undefined : vertical
      ? { marginInline: `var(--space-${space})` }
      : { marginBlock: `var(--space-${space})` }"
    :aria-orientation="vertical ? 'vertical' : undefined"
  />
</template>

<style src="../styles/components/paper-rule.css"></style>
