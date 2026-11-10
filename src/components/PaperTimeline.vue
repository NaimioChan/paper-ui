<script setup lang="ts">
import { computed } from 'vue'
import { resolveTimeline, type PaperTimelineItem } from '../lib/timeline'

const props = withDefaults(
  defineProps<{
    items: readonly PaperTimelineItem[]
    /** 显示右侧价格列 */
    showPrice?: boolean
  }>(),
  { showPrice: true },
)

const nodes = computed(() => resolveTimeline(props.items))
</script>

<template>
  <ol v-if="nodes.length" class="paper-timeline" :class="{ 'paper-timeline--price': showPrice }">
    <li
      v-for="node in nodes"
      :key="node.id"
      class="paper-timeline__node"
      :class="{ 'paper-timeline__node--current': node.isCurrent }"
      :aria-current="node.isCurrent ? 'step' : undefined"
    >
      <span class="paper-timeline__rail" aria-hidden="true">
        <span class="paper-timeline__line paper-timeline__line--above" :class="{ 'is-off': !node.lineAbove }"></span>
        <span class="paper-timeline__mark"></span>
        <span class="paper-timeline__line paper-timeline__line--below" :class="{ 'is-off': !node.lineBelow }"></span>
      </span>
      <span v-if="node.when" class="paper-timeline__when">{{ node.when }}</span>
      <span class="paper-timeline__title">
        {{ node.title }}
        <span v-if="node.isCurrent" class="paper-timeline__now">当前</span>
      </span>
      <span v-if="node.meta" class="paper-timeline__meta">{{ node.meta }}</span>
      <span v-if="showPrice && node.price" class="paper-timeline__price">{{ node.price }}</span>
    </li>
  </ol>
  <p v-else class="paper-timeline__empty">暂无流转记录</p>
</template>

<style src="../styles/components/paper-timeline.css"></style>
