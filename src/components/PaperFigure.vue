<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    src?: string
    alt?: string
    /** 裁切形状：rect 直角、round 正圆 */
    shape?: 'rect' | 'round'
    /** 宽高比，写作 '3 / 4' */
    ratio?: string
    /** 缺省时显示的字，通常取书名首字 */
    fallback?: string
    /** 实拍图加暖色与对比度微调，封面图通常不开 */
    photo?: boolean
    loading?: 'lazy' | 'eager'
    /** 正圆裁切时的直径 */
    size?: string
  }>(),
  { shape: 'rect', ratio: '3 / 4', photo: false, loading: 'lazy' },
)

const failed = ref(false)
watch(() => props.src, () => { failed.value = false })

const showFallback = computed(() => !props.src || failed.value)
const initial = computed(() => (props.fallback ?? '').trim().charAt(0) || '书')
</script>

<template>
  <figure
    class="paper-figure"
    :class="[`paper-figure--${shape}`, { 'paper-figure--empty': showFallback }]"
    :style="{
      '--figure-ratio': ratio,
      ...(shape === 'round' && size ? { '--figure-size': size } : {}),
    }"
  >
    <img
      v-if="!showFallback"
      class="paper-figure__img"
      :class="{ 'paper-figure__img--photo': photo }"
      :src="src"
      :alt="alt ?? ''"
      :loading="loading"
      decoding="async"
      @error="failed = true"
    />
    <span v-else class="paper-figure__fallback" :aria-label="alt" role="img">
      <span class="paper-figure__letter" aria-hidden="true">{{ initial }}</span>
    </span>
    <figcaption v-if="$slots.caption" class="paper-figure__caption">
      <slot name="caption" />
    </figcaption>
  </figure>
</template>

<style src="../styles/components/paper-figure.css"></style>
