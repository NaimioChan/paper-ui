<script setup lang="ts">
import type { PaperNavLink } from '../lib/nav'

withDefaults(
  defineProps<{
    id: string
    items: PaperNavLink[]
    activeId?: string | null
    open: boolean
    tone?: 'paper' | 'ink' | 'deep'
  }>(),
  { activeId: null, tone: 'paper' },
)

const emit = defineEmits<{ select: [link: PaperNavLink] }>()
</script>

<template>
  <div
    :id="id"
    class="paper-navbar-menu"
    :class="[`paper-navbar-menu--${tone}`, { 'paper-navbar-menu--open': open }]"
    :aria-hidden="!open"
  >
    <a
      v-for="item in items"
      :key="item.id"
      class="paper-navbar-menu__link"
      :class="{ 'is-active': item.id === activeId, 'is-disabled': item.disabled }"
      :href="item.disabled ? undefined : (item.href ?? `#${item.id}`)"
      :tabindex="open ? undefined : -1"
      :aria-current="item.id === activeId ? 'page' : undefined"
      :aria-disabled="item.disabled || undefined"
      @click.prevent="!item.disabled && emit('select', item)"
    >
      <span class="paper-navbar-menu__label">{{ item.label }}</span>
      <span v-if="item.badge !== undefined" class="paper-navbar-menu__badge">{{ item.badge }}</span>
    </a>
  </div>
</template>

<style src="../styles/components/paper-navbar.css"></style>
