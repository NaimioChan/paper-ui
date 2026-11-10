<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    description?: string
    /** 分隔线风格：顶线与底线，用于区块内空态 */
    ruled?: boolean
  }>(),
  { ruled: true },
)
</script>

<template>
  <div class="paper-empty" :class="{ 'paper-empty--ruled': ruled }">
    <p class="paper-empty__title">{{ title }}</p>
    <p v-if="description" class="paper-empty__description">{{ description }}</p>
    <div v-if="$slots.default" class="paper-empty__action">
      <slot />
    </div>
  </div>
</template>

<style src="../styles/components/paper-empty.css"></style>
