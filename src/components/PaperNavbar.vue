<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import PaperNavbarMenu from './PaperNavbarMenu.vue'
import type { PaperNavLink } from '../lib/nav'

const props = withDefaults(
  defineProps<{
    /** 导航项 */
    items?: PaperNavLink[]
    /** 当前项 id */
    activeId?: string | null
    /** 吸顶 */
    sticky?: boolean
    /** 底色 */
    tone?: 'paper' | 'ink' | 'deep'
    /** 底部一像素边线 */
    bordered?: boolean
    /** 导航项的链接目标，缺省用 href 或 #id */
    linkTarget?: string
    /** 窄屏菜单按钮文案 */
    menuLabel?: string
  }>(),
  {
    items: () => [],
    activeId: null,
    sticky: false,
    tone: 'paper',
    bordered: true,
    menuLabel: '菜单',
  },
)

const emit = defineEmits<{ select: [link: PaperNavLink]; 'update:activeId': [id: string] }>()

const mobileOpen = ref(false)

const hasItems = computed(() => props.items.length > 0)

function onSelect(link: PaperNavLink) {
  if (link.disabled) return
  emit('update:activeId', link.id)
  emit('select', link)
  mobileOpen.value = false
}

watch(
  () => props.activeId,
  () => {
    mobileOpen.value = false
  },
)
</script>

<template>
  <header
    class="paper-navbar"
    :class="[
      `paper-navbar--${tone}`,
      { 'paper-navbar--sticky': sticky, 'paper-navbar--bordered': bordered },
    ]"
  >
    <div class="paper-navbar__inner">
      <div class="paper-navbar__brand">
        <slot name="brand" />
      </div>

      <nav v-if="hasItems" class="paper-navbar__nav" :aria-label="menuLabel">
        <a
          v-for="item in items"
          :key="item.id"
          class="paper-navbar__link"
          :class="{ 'is-active': item.id === activeId, 'is-disabled': item.disabled }"
          :href="item.disabled ? undefined : (item.href ?? `#${item.id}`)"
          :aria-current="item.id === activeId ? 'page' : undefined"
          :aria-disabled="item.disabled || undefined"
          @click.prevent="onSelect(item)"
        >
          <span class="paper-navbar__label">{{ item.label }}</span>
          <span v-if="item.badge !== undefined" class="paper-navbar__badge">{{ item.badge }}</span>
        </a>
      </nav>

      <div class="paper-navbar__actions">
        <slot name="actions" />
        <button
          v-if="hasItems"
          class="paper-navbar__toggle"
          type="button"
          :aria-expanded="mobileOpen"
          aria-controls="paper-navbar-menu"
          @click="mobileOpen = !mobileOpen"
        >
          {{ menuLabel }}
        </button>
      </div>
    </div>

    <PaperNavbarMenu
      v-if="hasItems"
      id="paper-navbar-menu"
      :items="items"
      :active-id="activeId"
      :open="mobileOpen"
      :tone="tone"
      @select="onSelect"
    />
  </header>
</template>

<style src="../styles/components/paper-navbar.css"></style>
