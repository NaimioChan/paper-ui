<script setup lang="ts">
withDefaults(
  defineProps<{
    /** 数值，字符串以支持「¥ 42」这类拼接 */
    value: string | number
    label: string
    /** 数值后缀，小一号排在数值右侧 */
    unit?: string
    /** 数值用等宽字，位对齐 */
    mono?: boolean
  }>(),
  { mono: true },
)
</script>

<template>
  <div class="paper-stat">
    <p class="paper-stat__label">{{ label }}</p>
    <p class="paper-stat__value" :class="{ 'paper-stat__value--mono': mono }">
      {{ value }}<span v-if="unit" class="paper-stat__unit">{{ unit }}</span>
    </p>
  </div>
</template>

<style src="../styles/components/paper-stat.css"></style>
