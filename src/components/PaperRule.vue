<script setup lang="ts">
withDefaults(
  defineProps<{
    /** 竖向分隔线，用于行内分栏 */
    vertical?: boolean
    /** 粗细：hair 一像素，bold 两像素，heavy 四像素 */
    weight?: 'hair' | 'bold' | 'heavy'
    /** 用墨色边线代替纸黄线，作构成主义分割 */
    ink?: boolean
    /** 上下留白，取 --space-N 的档位 */
    space?: number
  }>(),
  { vertical: false, weight: 'hair', ink: false },
)
</script>

<template>
  <hr
    class="paper-rule"
    :class="[`paper-rule--${weight}`, { 'paper-rule--vertical': vertical, 'paper-rule--ink': ink }]"
    :style="space === undefined ? undefined : vertical
      ? { marginInline: `var(--space-${space})` }
      : { marginBlock: `var(--space-${space})` }"
    :aria-orientation="vertical ? 'vertical' : undefined"
  />
</template>

<style src="../styles/components/paper-rule.css"></style>
