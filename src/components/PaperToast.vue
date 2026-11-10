<script setup lang="ts">
import { usePaperToast } from '../lib/toast'

withDefaults(
  defineProps<{
    /** 距离视口顶部的偏移 */
    offset?: string
  }>(),
  { offset: 'var(--space-5)' },
)

const { items, dismiss } = usePaperToast()
</script>

<template>
  <Teleport to="body">
    <div class="paper-toast-stack" :style="{ '--toast-offset': offset }" role="status" aria-live="polite">
      <TransitionGroup name="paper-toast">
        <div
          v-for="item in items"
          :key="item.id"
          class="paper-toast"
          :class="`paper-toast--${item.tone}`"
        >
          <span class="paper-toast__message">{{ item.message }}</span>
          <button class="paper-toast__close" type="button" aria-label="关闭提示" @click="dismiss(item.id)">×</button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style src="../styles/components/paper-toast.css"></style>
