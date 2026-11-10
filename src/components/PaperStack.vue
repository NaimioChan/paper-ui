<script setup lang="ts">
withDefaults(
  defineProps<{
    /** 间距令牌名，取 1-10，对应 --space-N */
    gap?: number | string
    /** 方向，默认纵向 */
    direction?: 'vertical' | 'horizontal'
    /** 交叉轴对齐 */
    align?: 'stretch' | 'start' | 'center' | 'end'
    /** 主轴分布 */
    justify?: 'start' | 'center' | 'end' | 'between'
    as?: string
  }>(),
  { gap: 4, direction: 'vertical', align: 'stretch', justify: 'start', as: 'div' },
)
</script>

<template>
  <component
    :is="as"
    class="paper-stack"
    :class="[`paper-stack--${direction}`, `paper-stack--align-${align}`, `paper-stack--justify-${justify}`]"
    :style="{ '--stack-gap': typeof gap === 'number' ? `var(--space-${gap})` : gap }"
  >
    <slot />
  </component>
</template>

<style src="../styles/components/paper-stack.css"></style>
