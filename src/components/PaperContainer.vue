<script setup lang="ts">
withDefaults(
  defineProps<{
    /** 版心宽度档位，对应 --layout-narrow / --layout-max / --layout-wide */
    width?: 'narrow' | 'default' | 'wide' | 'full'
    /** 去掉左右留白，用于满宽色块内部再套一层 Container */
    flush?: boolean
    /** 语义标签，默认 div；页面外层建议用 main 或 section */
    as?: string
  }>(),
  { width: 'default', flush: false, as: 'div' },
)
</script>

<template>
  <component :is="as" class="paper-container" :class="[`paper-container--${width}`, { 'paper-container--flush': flush }]">
    <slot />
  </component>
</template>

<style src="../styles/components/paper-container.css"></style>
