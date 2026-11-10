<script setup lang="ts">
withDefaults(
  defineProps<{
    /** 文本。给出时才能启用 offset 重影（需要一份可复制的副本） */
    text?: string
    /** 排布方向 */
    orientation?: 'horizontal' | 'vertical'
    /** 叠印一层描边副本，形成套印错位 */
    offset?: boolean
    /** 颜色 */
    tone?: 'ink' | 'paper' | 'orange' | 'green' | 'outline'
    as?: string
  }>(),
  { orientation: 'horizontal', offset: false, tone: 'ink', as: 'p' },
)
</script>

<template>
  <component
    :is="as"
    class="paper-mega"
    :class="[
      `paper-mega--${tone}`,
      `paper-mega--${orientation}`,
      { 'paper-mega--offset': offset && text },
    ]"
  >
    <span class="paper-mega__text" :data-text="text"><slot>{{ text }}</slot></span>
  </component>
</template>

<style src="../styles/components/paper-mega.css"></style>
