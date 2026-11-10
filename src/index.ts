import type { App, Plugin } from 'vue'

import './styles/index.css'

import PaperContainer from './components/PaperContainer.vue'
import PaperGrid from './components/PaperGrid.vue'
import PaperCell from './components/PaperCell.vue'
import PaperStack from './components/PaperStack.vue'
import PaperButton from './components/PaperButton.vue'
import PaperField from './components/PaperField.vue'
import PaperInput from './components/PaperInput.vue'
import PaperSelect from './components/PaperSelect.vue'
import PaperCheckbox from './components/PaperCheckbox.vue'
import PaperRadio from './components/PaperRadio.vue'
import PaperRule from './components/PaperRule.vue'
import PaperCard from './components/PaperCard.vue'
import PaperTag from './components/PaperTag.vue'
import PaperStat from './components/PaperStat.vue'
import PaperStatGroup from './components/PaperStatGroup.vue'
import PaperFigure from './components/PaperFigure.vue'
import PaperBadge from './components/PaperBadge.vue'
import PaperSkeleton from './components/PaperSkeleton.vue'
import PaperEmpty from './components/PaperEmpty.vue'
import PaperTimeline from './components/PaperTimeline.vue'
import PaperDialog from './components/PaperDialog.vue'
import PaperTable from './components/PaperTable.vue'
import PaperTabs from './components/PaperTabs.vue'
import PaperToast from './components/PaperToast.vue'
import PaperSlab from './components/PaperSlab.vue'
import PaperMega from './components/PaperMega.vue'
import PaperComposition from './components/PaperComposition.vue'
import PaperNavbar from './components/PaperNavbar.vue'
import PaperNavbarMenu from './components/PaperNavbarMenu.vue'
import PaperSidebar from './components/PaperSidebar.vue'
import PaperShell from './components/PaperShell.vue'

export {
  PaperContainer,
  PaperGrid,
  PaperCell,
  PaperStack,
  PaperButton,
  PaperField,
  PaperInput,
  PaperSelect,
  PaperCheckbox,
  PaperRadio,
  PaperRule,
  PaperCard,
  PaperTag,
  PaperStat,
  PaperStatGroup,
  PaperFigure,
  PaperBadge,
  PaperSkeleton,
  PaperEmpty,
  PaperTimeline,
  PaperDialog,
  PaperTable,
  PaperTabs,
  PaperToast,
  PaperSlab,
  PaperMega,
  PaperComposition,
  PaperNavbar,
  PaperNavbarMenu,
  PaperSidebar,
  PaperShell,
}

export { resolveTimeline } from './lib/timeline'
export type { PaperTimelineItem, ResolvedTimelineNode } from './lib/timeline'
export { usePaperToast } from './lib/toast'
export type { PaperToastItem, PaperToastTone } from './lib/toast'
export { filterFocusable, nextFocusIndex, FOCUSABLE_SELECTOR } from './lib/focus'
export {
  activeGroupIds,
  flattenNav,
  groupsToReveal,
  initialOpenState,
  nextNavIndex,
  visibleNav,
} from './lib/nav'
export type { PaperNavEntry, PaperNavGroup, PaperNavLink } from './lib/nav'
export type { PaperSelectOption } from './components/PaperSelect.vue'
export type { PaperTabItem } from './components/PaperTabs.vue'
export type { PaperTableColumn } from './components/PaperTable.vue'

const components = {
  PaperContainer,
  PaperGrid,
  PaperCell,
  PaperStack,
  PaperButton,
  PaperField,
  PaperInput,
  PaperSelect,
  PaperCheckbox,
  PaperRadio,
  PaperRule,
  PaperCard,
  PaperTag,
  PaperStat,
  PaperStatGroup,
  PaperFigure,
  PaperBadge,
  PaperSkeleton,
  PaperEmpty,
  PaperTimeline,
  PaperDialog,
  PaperTable,
  PaperTabs,
  PaperToast,
  PaperSlab,
  PaperMega,
  PaperComposition,
  PaperNavbar,
  PaperNavbarMenu,
  PaperSidebar,
  PaperShell,
}

/**
 * 全量注册插件。也可以按需 import 单个组件，两者不冲突。
 * 注册后仍需在入口引入 @naimio/paper-ui/style.css。
 */
export const PaperUI: Plugin = {
  install(app: App) {
    for (const [name, component] of Object.entries(components)) {
      app.component(name, component)
    }
  },
}

export default PaperUI
