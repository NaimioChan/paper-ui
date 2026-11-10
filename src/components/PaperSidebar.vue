<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  initialOpenState,
  nextNavIndex,
  visibleNav,
  type PaperNavGroup,
  type PaperNavLink,
} from '../lib/nav'

const props = withDefaults(
  defineProps<{
    /** 分组导航数据 */
    groups?: PaperNavGroup[]
    /** 当前项 id */
    activeId?: string | null
    /** 宽度 */
    width?: string
    /** 底色 */
    tone?: 'paper' | 'deep' | 'ink'
    /** 右侧一像素边线 */
    bordered?: boolean
    /** 窄屏改为抽屉，由父级控制显隐 */
    drawerOpen?: boolean
  }>(),
  {
    groups: () => [],
    activeId: null,
    width: '248px',
    tone: 'deep',
    bordered: true,
    drawerOpen: false,
  },
)

const emit = defineEmits<{ select: [link: PaperNavLink]; 'update:drawerOpen': [open: boolean] }>()

const openState = ref<Record<string, boolean>>(initialOpenState(props.groups))

watch(
  () => props.groups,
  (groups) => {
    const next = initialOpenState(groups)
    // 保留用户已手动切换过的分组状态
    for (const id of Object.keys(next)) {
      if (id in openState.value) next[id] = openState.value[id]
    }
    openState.value = next
  },
  { deep: false },
)

const entries = computed(() => visibleNav(props.groups, openState.value))

const focusIndex = ref(-1)

function toggleGroup(groupId: string) {
  openState.value = { ...openState.value, [groupId]: !openState.value[groupId] }
}

function onSelect(link: PaperNavLink) {
  if (link.disabled) return
  emit('select', link)
  emit('update:drawerOpen', false)
}

function focusAt(index: number) {
  focusIndex.value = index
}

function stepFocus(delta: number, root: HTMLElement | null) {
  if (!root) return
  const links = Array.from(root.querySelectorAll<HTMLElement>('.paper-sidebar__link:not(.is-disabled)'))
  const current = links.findIndex((el) => el === globalThis.document.activeElement)
  const next = nextNavIndex(current, links.length, delta)
  links[next]?.focus()
}

function onKeydown(event: KeyboardEvent) {
  const root = event.currentTarget as HTMLElement | null
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    stepFocus(1, root)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    stepFocus(-1, root)
  } else if (event.key === 'Home') {
    event.preventDefault()
    const links = root?.querySelectorAll<HTMLElement>('.paper-sidebar__link:not(.is-disabled)')
    links?.[0]?.focus()
  } else if (event.key === 'End') {
    event.preventDefault()
    const links = root?.querySelectorAll<HTMLElement>('.paper-sidebar__link:not(.is-disabled)')
    links?.[links.length - 1]?.focus()
  }
}

defineExpose({ focusAt })
</script>

<template>
  <aside
    class="paper-sidebar"
    :class="[
      `paper-sidebar--${tone}`,
      { 'paper-sidebar--bordered': bordered, 'paper-sidebar--drawer-open': drawerOpen },
    ]"
    :style="{ '--sidebar-width': width }"
  >
    <div class="paper-sidebar__panel">
      <div v-if="$slots.brand" class="paper-sidebar__brand">
        <slot name="brand" />
      </div>

      <nav class="paper-sidebar__nav" aria-label="侧栏导航" @keydown="onKeydown">
        <div v-for="group in groups" :key="group.id" class="paper-sidebar__group">
          <component
            :is="group.collapsible ? 'button' : 'p'"
            v-if="group.label"
            class="paper-sidebar__group-title"
            :class="{ 'paper-sidebar__group-title--toggle': group.collapsible }"
            :type="group.collapsible ? 'button' : undefined"
            :aria-expanded="group.collapsible ? openState[group.id] !== false : undefined"
            :aria-controls="`paper-sidebar-group-${group.id}`"
            @click="group.collapsible && toggleGroup(group.id)"
          >
            <span>{{ group.label }}</span>
            <span
              v-if="group.collapsible"
              class="paper-sidebar__chevron"
              :class="{ 'is-open': openState[group.id] !== false }"
              aria-hidden="true"
            ></span>
          </component>

          <div
            v-show="!group.collapsible || openState[group.id] !== false"
            :id="`paper-sidebar-group-${group.id}`"
            class="paper-sidebar__group-body"
          >
            <a
              v-for="link in group.items"
              :key="link.id"
              class="paper-sidebar__link"
              :class="{ 'is-active': link.id === activeId, 'is-disabled': link.disabled }"
              :href="link.disabled ? undefined : (link.href ?? `#${link.id}`)"
              :aria-current="link.id === activeId ? 'page' : undefined"
              :aria-disabled="link.disabled || undefined"
              :tabindex="link.disabled ? -1 : undefined"
              @click.prevent="onSelect(link)"
            >
              <span class="paper-sidebar__label">{{ link.label }}</span>
              <span v-if="link.badge !== undefined" class="paper-sidebar__badge">{{ link.badge }}</span>
            </a>
          </div>
        </div>

        <p v-if="entries.length === 0" class="paper-sidebar__empty">无导航项</p>
      </nav>

      <div v-if="$slots.footer" class="paper-sidebar__footer">
        <slot name="footer" />
      </div>
    </div>
  </aside>

  <Teleport to="body">
    <div
      v-if="drawerOpen"
      class="paper-sidebar-scrim"
      @click="emit('update:drawerOpen', false)"
    ></div>
  </Teleport>
</template>

<style src="../styles/components/paper-sidebar.css"></style>
