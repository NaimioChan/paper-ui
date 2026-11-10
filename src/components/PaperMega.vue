<script setup lang="ts">
withDefaults(
  defineProps<{
    /** 文本；也可用默认插槽 */
    text?: string
    /** 排布方向 */
    orientation?: 'horizontal' | 'vertical'
    /** 颜色 */
    tone?: 'ink' | 'paper' | 'orange' | 'green' | 'outline'
    as?: string
  }>(),
  { orientation: 'horizontal', tone: 'ink', as: 'p' },
)
</script>

<template>
  <component
    :is="as"
    class="paper-mega"
    :class="[`paper-mega--${tone}`, `paper-mega--${orientation}`]"
  ><slot>{{ text }}</slot></component>
</template>

<style src="../styles/components/paper-mega.css"></style>
