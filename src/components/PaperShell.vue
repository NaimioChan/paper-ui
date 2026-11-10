<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** 顶栏是否整体吸顶 */
    navbarSticky?: boolean
    /** 侧栏宽度；置空则不预留侧栏栏位 */
    sidebarWidth?: string
    /** 内容区最大宽度，透传给内部容器 */
    contentWidth?: 'narrow' | 'default' | 'wide' | 'full'
    /** 内容区留白，none 时不套版心 */
    padding?: 'none' | 'sm' | 'md' | 'lg'
  }>(),
  {
    navbarSticky: true,
    sidebarWidth: '248px',
    contentWidth: 'default',
    padding: 'md',
  },
)

const emit = defineEmits<{ 'update:drawerOpen': [open: boolean] }>()

const hasSidebar = computed(() => Boolean(props.sidebarWidth))
</script>

<template>
  <div class="paper-shell" :style="hasSidebar ? { '--shell-sidebar-width': sidebarWidth } : undefined">
    <div v-if="$slots.navbar" class="paper-shell__navbar" :class="{ 'paper-shell__navbar--sticky': navbarSticky }">
      <slot name="navbar" />
    </div>

    <div class="paper-shell__body" :class="{ 'paper-shell__body--sidebar': hasSidebar }">
      <div v-if="$slots.sidebar" class="paper-shell__sidebar">
        <slot name="sidebar" :close-drawer="() => emit('update:drawerOpen', false)" />
      </div>

      <main class="paper-shell__main">
        <div
          v-if="padding !== 'none'"
          class="paper-shell__content"
          :class="[`paper-shell__content--${contentWidth}`, `paper-shell__content--pad-${padding}`]"
        >
          <slot />
        </div>
        <slot v-else />
      </main>
    </div>

    <div v-if="$slots.footer" class="paper-shell__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style src="../styles/components/paper-shell.css"></style>
