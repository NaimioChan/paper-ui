<script setup lang="ts">
import { ref } from 'vue'
import {
  PaperBadge,
  PaperButton,
  PaperCard,
  PaperCell,
  PaperCheckbox,
  PaperContainer,
  PaperDialog,
  PaperEmpty,
  PaperFigure,
  PaperGrid,
  PaperInput,
  PaperRadio,
  PaperRule,
  PaperSelect,
  PaperSkeleton,
  PaperStack,
  PaperStat,
  PaperStatGroup,
  PaperTable,
  PaperTabs,
  PaperTag,
  PaperTimeline,
  PaperToast,
  usePaperToast,
  type PaperTableColumn,
  type PaperTabItem,
  type PaperTimelineItem,
} from 'paper-ui'

const toast = usePaperToast()

const title = ref('')
const isbn = ref('9787111544937')
const price = ref('42')
const semester = ref<string | number | null>(null)
const condition = ref('clean')
const agree = ref(true)
const note = ref('')

const dialogOpen = ref(false)
const dialogLoading = ref(false)

const tab = ref('onsale')
const tabs: PaperTabItem[] = [
  { value: 'onsale', label: '在售', count: 12 },
  { value: 'ordered', label: '已下单', count: 3 },
  { value: 'done', label: '已完成' },
  { value: 'off', label: '已下架', disabled: true },
]

const chain: PaperTimelineItem[] = [
  { id: '1', when: '2024 秋', title: '陈雨 → 李书言', meta: '计算机科学与技术 · 刘老师班', price: '¥ 46' },
  { id: '2', when: '2025 春', title: '李书言 → 周予安', meta: '同院系转手，成色干净', price: '¥ 38' },
  { id: '3', when: '2025 秋', title: '周予安 在售', meta: '三处笔记，附赠习题册', price: '¥ 26' },
]

const columns: PaperTableColumn[] = [
  { key: 'title', title: '教材', width: '1fr' },
  { key: 'seller', title: '出让人', width: '120px' },
  { key: 'semester', title: '学期', width: '110px' },
  { key: 'price', title: '价格', width: '90px', numeric: true },
  { key: 'status', title: '状态', width: '100px' },
]
const rows = [
  { id: 1, title: '算法导论（第三版）', seller: '周予安', semester: '2025 秋', price: '¥ 26', status: '在售' },
  { id: 2, title: '编译原理（龙书）', seller: '陈雨', semester: '2025 秋', price: '¥ 30', status: '待付款' },
  { id: 3, title: '计算机组成原理', seller: '李书言', semester: '2025 春', price: '¥ 18', status: '已完成' },
]

function openDialog() {
  dialogOpen.value = true
}
function confirmDialog() {
  dialogLoading.value = true
  setTimeout(() => {
    dialogLoading.value = false
    dialogOpen.value = false
    toast.show('已确认收书，订单进入待评价', { tone: 'green' })
  }, 900)
}
function showToast(tone: 'ink' | 'orange' | 'green') {
  toast.show(
    tone === 'orange' ? 'ISBN 校验失败，请检查末位校验码' : '价格已更新',
    { tone },
  )
}
</script>

<template>
  <PaperContainer width="default">
    <header class="pv-head">
      <p class="pv-eyebrow paper-mono">paper-ui · 0.1.0 · 组件预览</p>
      <h1>纸感直角设计系统</h1>
      <p class="pv-lede">
        为教材流转类界面准备的一套外观原语。所有组件只读 CSS 变量，不使用圆角、阴影与缩放动效。
        本页同时是验收页：每个组件都在真实内容里出现一次。
      </p>
      <div class="pv-head__actions">
        <PaperButton variant="solid" @click="openDialog">打开确认弹窗</PaperButton>
        <PaperButton @click="showToast('ink')">轻提示</PaperButton>
        <PaperButton variant="ghost" @click="showToast('orange')">错误提示</PaperButton>
      </div>
    </header>

    <PaperRule :space="7" />

    <section class="pv-section">
      <div class="pv-section__head">
        <span class="pv-section__no paper-mono">01</span>
        <h2>排版基座</h2>
        <p class="pv-section__desc">字号来自 clamp，桌面与移动用同一套令牌连续过渡。</p>
      </div>
      <PaperGrid>
        <PaperCell :span="8">
          <PaperStack :gap="4">
            <p class="pv-display">页首大标题 64 / 36</p>
            <p class="pv-title">区块标题 36 / 26</p>
            <p class="pv-card-title">卡片标题 22 / 18</p>
            <p>正文 16 / 15，行高 1.65。教材流转平台的核心信息是价格、学期与双方，正文承担解释，不承担强调。</p>
            <p class="paper-meta">标签与注脚 12 / 11，字距 0.02em，等宽数字用于 ISBN 与金额。</p>
            <p class="paper-mono pv-isbn">ISBN 978-7-111-54493-7</p>
          </PaperStack>
        </PaperCell>
        <PaperCell :span="4">
          <PaperStack :gap="3">
            <p class="paper-meta">主色板</p>
            <div class="pv-swatches">
              <span class="pv-swatch" style="background: var(--paper)"></span>
              <span class="pv-swatch" style="background: var(--paper-deep)"></span>
              <span class="pv-swatch" style="background: var(--ink)"></span>
              <span class="pv-swatch" style="background: var(--green)"></span>
              <span class="pv-swatch" style="background: var(--green-mid)"></span>
              <span class="pv-swatch" style="background: var(--orange)"></span>
              <span class="pv-swatch" style="background: var(--line)"></span>
            </div>
            <p class="paper-meta">墨 / 纸黄 14.79:1 · 深纸绿 / 纸黄 7.74:1</p>
          </PaperStack>
        </PaperCell>
      </PaperGrid>
    </section>

    <PaperRule :space="7" />

    <section class="pv-section">
      <div class="pv-section__head">
        <span class="pv-section__no paper-mono">02</span>
        <h2>按钮与表单</h2>
        <p class="pv-section__desc">悬停反转颜色，聚焦是两像素纸橙描边，没有位移与缩放。</p>
      </div>

      <PaperGrid>
        <PaperCell :span="6">
          <PaperStack :gap="5">
            <PaperStack direction="horizontal" :gap="3" align="center">
              <PaperButton variant="solid">确认收书</PaperButton>
              <PaperButton>查看详情</PaperButton>
              <PaperButton size="sm">小尺寸</PaperButton>
              <PaperButton variant="ghost">撤销</PaperButton>
            </PaperStack>
            <PaperStack direction="horizontal" :gap="3" align="center">
              <PaperButton disabled>已锁定</PaperButton>
              <PaperButton variant="solid" loading>提交中</PaperButton>
              <PaperButton variant="ghost" disabled>不可用</PaperButton>
            </PaperStack>
            <PaperButton block variant="solid">撑满宽度的主行动</PaperButton>
            <PaperStack direction="horizontal" :gap="5" align="center">
              <PaperCheckbox v-model="agree" label="同意当面交易" hint="不经过平台担保" />
              <PaperCheckbox :model-value="false" indeterminate label="全选" />
              <PaperCheckbox :model-value="false" disabled label="已失效" />
            </PaperStack>
            <PaperStack direction="horizontal" :gap="5" align="center">
              <PaperRadio v-model="condition" name="cond" value="clean" label="干净" />
              <PaperRadio v-model="condition" name="cond" value="few" label="少量笔记" />
              <PaperRadio v-model="condition" name="cond" value="dense" label="笔记密集" />
            </PaperStack>
          </PaperStack>
        </PaperCell>

        <PaperCell :span="6">
          <PaperStack :gap="5">
            <PaperInput v-model="title" label="教材名称" placeholder="例如 算法导论（第三版）" note="最多 40 字" :maxlength="40" />
            <PaperInput v-model="isbn" label="ISBN" mono hint="扫描封底条码或手填 13 位" />
            <PaperInput
              v-model="price"
              label="定价"
              type="number"
              mono
              error="定价需在 0.01 到 9999 之间"
            />
            <PaperSelect
              v-model="semester"
              label="开课学期"
              placeholder="选择学期"
              :options="[
                { value: '2025-fall', label: '2025 秋' },
                { value: '2026-spring', label: '2026 春' },
                { value: '2026-fall', label: '2026 秋', disabled: true },
              ]"
            />
            <PaperInput v-model="note" label="书况补充" :rows="3" hint="说明笔记位置、赠品、是否缺页" />
          </PaperStack>
        </PaperCell>
      </PaperGrid>
    </section>

    <PaperRule :space="7" />

    <section class="pv-section">
      <div class="pv-section__head">
        <span class="pv-section__no paper-mono">03</span>
        <h2>标签与卡片</h2>
        <p class="pv-section__desc">卡片不用边框与阴影，靠底色与一像素内线分栏。</p>
      </div>

      <PaperGrid>
        <PaperCell :span="4">
          <PaperStack :gap="4">
            <p class="paper-meta">标签三档</p>
            <PaperStack direction="horizontal" :gap="2">
              <PaperTag tone="quiet">干净</PaperTag>
              <PaperTag tone="mid">少量笔记</PaperTag>
              <PaperTag tone="strong">笔记密集</PaperTag>
            </PaperStack>
            <PaperStack direction="horizontal" :gap="2">
              <PaperTag tone="quiet" outline>待付款</PaperTag>
              <PaperTag tone="mid" outline>运输中</PaperTag>
              <PaperTag tone="strong" outline>已完成</PaperTag>
            </PaperStack>
            <PaperStack direction="horizontal" :gap="3" align="center">
              <span class="paper-meta">未读数</span>
              <PaperBadge :count="3" />
              <PaperBadge :count="128" />
              <PaperBadge dot tone="orange" />
            </PaperStack>
          </PaperStack>
        </PaperCell>

        <PaperCell :span="4">
          <PaperCard tone="deep" padding="md">
            <template #header>
              <h3>在售概览</h3>
              <PaperTag tone="quiet">12 本</PaperTag>
            </template>
            <p>本学期本院系共有 12 本教材在流转，其中 3 本带笔记。</p>
            <template #footer>
              <PaperButton size="sm" block>查看全部</PaperButton>
            </template>
          </PaperCard>
        </PaperCell>

        <PaperCell :span="4">
          <PaperCard tone="ink" padding="md">
            <template #header>
              <h3>当面交易提示</h3>
            </template>
            <p>价格无需在线支付。约定时间地点，验书后当面结清。</p>
            <template #footer>
              <PaperButton size="sm" block>了解流程</PaperButton>
            </template>
          </PaperCard>
        </PaperCell>
      </PaperGrid>
    </section>

    <PaperRule :space="7" />

    <section class="pv-section">
      <div class="pv-section__head">
        <span class="pv-section__no paper-mono">04</span>
        <h2>数据展示</h2>
        <p class="pv-section__desc">统计块是墨底纸黄字，表格只有横线，数字列等宽右对齐。</p>
      </div>

      <PaperStack :gap="6">
        <PaperStatGroup :columns="4">
          <PaperStat value="128" label="在售教材" unit="本" />
          <PaperStat value="46" label="本学期成交" unit="单" />
          <PaperStat value="¥ 32" label="平均成交价" />
          <PaperStat value="2.4" label="平均流转次数" unit="次" />
        </PaperStatGroup>

        <div>
          <PaperTabs v-model="tab" :tabs="tabs" />
          <div class="pv-tabpanel">
            <p v-if="tab === 'onsale'">在售 12 本，最近更新于今天 09:20。</p>
            <p v-else-if="tab === 'ordered'">3 单待当面交易，其中一单已超期两天。</p>
            <p v-else-if="tab === 'done'">已完成订单进入历史，可评价书况与守约情况。</p>
            <p v-else>该分栏未被选中。</p>
          </div>
        </div>

        <PaperTable :columns="columns" :rows="rows" />
      </PaperStack>
    </section>

    <PaperRule :space="7" />

    <section class="pv-section">
      <div class="pv-section__head">
        <span class="pv-section__no paper-mono">05</span>
        <h2>流转链</h2>
        <p class="pv-section__desc">竖线贯穿，节点是 8px 正方形，当前在售节点用纸橙。</p>
      </div>

      <PaperGrid>
        <PaperCell :span="8">
          <PaperCard tone="paper" padding="lg">
            <template #header>
              <h3>算法导论（第三版）</h3>
              <span class="paper-mono pv-price">¥ 26</span>
            </template>
            <PaperTimeline :items="chain" />
          </PaperCard>
        </PaperCell>
        <PaperCell :span="4">
          <PaperStack :gap="5">
            <p class="paper-meta">封面与缺省态</p>
            <PaperStack direction="horizontal" :gap="4" align="start">
              <PaperFigure shape="round" size="120px" fallback="算" />
              <PaperFigure fallback="编译原理" style="max-width: 120px" />
            </PaperStack>
            <PaperRule />
            <PaperStack direction="horizontal" :gap="4" align="center">
              <PaperFigure shape="round" size="56px" fallback="周" />
              <PaperStack :gap="1">
                <span class="pv-name">周予安</span>
                <span class="paper-meta">计算机科学与技术 · 3 次流转</span>
              </PaperStack>
            </PaperStack>
          </PaperStack>
        </PaperCell>
      </PaperGrid>
    </section>

    <PaperRule :space="7" />

    <section class="pv-section">
      <div class="pv-section__head">
        <span class="pv-section__no paper-mono">06</span>
        <h2>反馈层</h2>
        <p class="pv-section__desc">弹窗遮罩不模糊，轻提示从顶部滑入，空态与骨架屏不用插图。</p>
      </div>

      <PaperGrid>
        <PaperCell :span="6">
          <PaperStack :gap="4">
            <p class="paper-meta">空态</p>
            <PaperEmpty
              title="还没有在售教材"
              description="上架第一本书后，这里会显示流转次数与平均成交价。"
            >
              <PaperButton size="sm" variant="solid">发布教材</PaperButton>
            </PaperEmpty>
          </PaperStack>
        </PaperCell>
        <PaperCell :span="6">
          <PaperStack :gap="4">
            <p class="paper-meta">骨架屏</p>
            <PaperCard tone="paper" padding="md">
              <PaperStack :gap="3">
                <PaperSkeleton width="40%" height="1.4em" />
                <PaperSkeleton :lines="3" height="0.9em" />
                <PaperSkeleton width="120px" height="2.2em" />
              </PaperStack>
            </PaperCard>
          </PaperStack>
        </PaperCell>
      </PaperGrid>
    </section>

    <PaperRule :space="7" />

    <footer class="pv-foot">
      <p class="paper-meta">paper-ui · 直角、纸色、无缩放 · 消费方为 bookchain</p>
    </footer>
  </PaperContainer>

  <PaperDialog
    v-model:open="dialogOpen"
    title="确认收书"
    description="确认后订单进入待评价，书况描述将锁定。"
    size="sm"
    confirm-text="确认收书"
    cancel-text="再检查一下"
    :loading="dialogLoading"
    @confirm="confirmDialog"
  >
    <PaperStack :gap="3">
      <PaperStack direction="horizontal" :gap="3" align="center">
        <PaperFigure shape="round" size="48px" fallback="算" />
        <PaperStack :gap="1">
          <span class="pv-name">算法导论（第三版）</span>
          <span class="paper-meta">周予安 · 2025 秋 · ¥ 26</span>
        </PaperStack>
      </PaperStack>
      <PaperRule />
      <PaperInput label="收货备注" placeholder="例如 周三中午 图书馆一层" :rows="2" />
      <PaperCheckbox :model-value="true" label="书况与描述一致" hint="验书后勾选，可申请仲裁" />
    </PaperStack>
  </PaperDialog>

  <PaperToast />
</template>

<style scoped>
.pv-head {
  padding-block: var(--space-9) var(--space-7);
  max-width: 62ch;
}

.pv-eyebrow {
  font-size: var(--text-meta);
  letter-spacing: 0.06em;
  color: var(--ink-soft);
  margin-bottom: var(--space-4);
}

.pv-lede {
  margin-top: var(--space-5);
  color: var(--ink-soft);
  max-width: 56ch;
}

.pv-head__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-6);
}

.pv-section {
  padding-block: var(--space-6);
}

.pv-section__head {
  display: grid;
  grid-template-columns: 40px minmax(0, max-content) 1fr;
  align-items: baseline;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.pv-section__no {
  font-size: var(--text-meta);
  color: var(--orange);
}

.pv-section__desc {
  font-size: var(--text-meta);
  letter-spacing: var(--tracking-meta);
  color: var(--ink-soft);
}

.pv-display {
  font-size: var(--text-display);
  font-weight: var(--weight-bold);
  line-height: var(--leading-display);
  letter-spacing: var(--tracking-display);
}

.pv-title {
  font-size: var(--text-title);
  font-weight: var(--weight-bold);
  line-height: var(--leading-title);
}

.pv-card-title {
  font-size: var(--text-card);
  font-weight: var(--weight-semibold);
}

.pv-isbn {
  font-size: var(--text-body);
  letter-spacing: 0.04em;
}

.pv-swatches {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  border: var(--line-hair) solid var(--line);
}

.pv-swatch {
  height: 44px;
}

.pv-tabpanel {
  padding-block: var(--space-3);
  color: var(--ink-soft);
  border-bottom: var(--line-hair) solid var(--line);
}

.pv-price {
  font-size: var(--text-card);
}

.pv-name {
  font-size: var(--text-body);
  font-weight: var(--weight-semibold);
}

.pv-foot {
  padding-block: var(--space-7) var(--space-9);
}

@media (max-width: 640px) {
  .pv-section__head {
    grid-template-columns: 32px 1fr;
  }

  .pv-section__desc {
    grid-column: 2;
  }
}
</style>
