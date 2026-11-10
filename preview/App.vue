<script setup lang="ts">
import { ref } from 'vue'
import {
  PaperBadge,
  PaperButton,
  PaperCard,
  PaperCell,
  PaperCheckbox,
  PaperComposition,
  PaperContainer,
  PaperDialog,
  PaperEmpty,
  PaperFigure,
  PaperGrid,
  PaperInput,
  PaperMega,
  PaperRadio,
  PaperRule,
  PaperSelect,
  PaperSkeleton,
  PaperSlab,
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
]

const chain: PaperTimelineItem[] = [
  { id: '1', when: '第一学期', title: '出让 → 受让', meta: '同院系转手', price: '¥ 46' },
  { id: '2', when: '第二学期', title: '受让 → 再转手', meta: '成色干净', price: '¥ 38' },
  { id: '3', when: '第三学期', title: '当前在售', meta: '三处笔记', price: '¥ 26' },
]

const columns: PaperTableColumn[] = [
  { key: 'title', title: '名称', width: '1fr' },
  { key: 'seller', title: '经手人', width: '120px' },
  { key: 'term', title: '学期', width: '110px' },
  { key: 'price', title: '金额', width: '90px', numeric: true },
  { key: 'status', title: '状态', width: '100px' },
]
const rows = [
  { id: 1, title: '算法导论（第三版）', seller: '周予安', term: '2025 秋', price: '¥ 26', status: '在售' },
  { id: 2, title: '编译原理（龙书）', seller: '陈雨', term: '2025 秋', price: '¥ 30', status: '待付款' },
  { id: 3, title: '计算机组成原理', seller: '李书言', term: '2025 春', price: '¥ 18', status: '已完成' },
]

function openDialog() {
  dialogOpen.value = true
}
function confirmDialog() {
  dialogLoading.value = true
  setTimeout(() => {
    dialogLoading.value = false
    dialogOpen.value = false
    toast.show('操作已受理', { tone: 'green' })
  }, 900)
}
function showToast(tone: 'ink' | 'orange' | 'green' | 'gold') {
  toast.show(tone === 'orange' ? '校验未通过' : '已更新', { tone })
}
</script>

<template>
  <PaperContainer>
    <header class="pv-hero">
      <PaperMega text="PAPER" tone="ink" offset class="pv-hero__mega" />
      <PaperComposition layout="offset" ratio="1.6fr 1fr">
        <PaperStack :gap="5">
          <p class="pv-eyebrow paper-mono">paper-ui · 0.2.0</p>
          <h1 class="pv-hero__title">纸感直角设计系统</h1>
          <p class="pv-lede">
            一组外观原语。直角色块、一像素线、纸噪纹理与构成主义构图。
            全部样式读 CSS 变量，色、字、距、噪点浓度均可覆盖。
          </p>
          <PaperStack direction="horizontal" :gap="3">
            <PaperButton variant="solid" @click="openDialog">打开弹窗</PaperButton>
            <PaperButton @click="showToast('ink')">轻提示</PaperButton>
            <PaperButton variant="ghost" @click="showToast('orange')">错误</PaperButton>
          </PaperStack>
        </PaperStack>
        <PaperSlab tone="ink" padding="lg" noise bar="orange">
          <PaperStack :gap="4">
            <span class="pv-meta-inverse">悬停任意描边按钮</span>
            <p class="pv-slab-note">填充从左向右拉出，文字在色块上层保持可读。</p>
            <PaperRule ink />
            <PaperStack direction="horizontal" :gap="2">
              <PaperTag tone="strong">直角</PaperTag>
              <PaperTag tone="gold">纸噪</PaperTag>
              <PaperTag tone="mid">构成</PaperTag>
            </PaperStack>
          </PaperStack>
        </PaperSlab>
      </PaperComposition>
    </header>

    <PaperRule :space="8" ink weight="heavy" />

    <section class="pv-section">
      <div class="pv-head">
        <span class="pv-no paper-mono">01</span>
        <h2>排版与色板</h2>
      </div>
      <PaperGrid>
        <PaperCell :span="7">
          <PaperStack :gap="4">
            <p class="pv-display">Display 64 / 36</p>
            <p class="pv-title">Title 36 / 26</p>
            <p class="pv-card-title">Card 22 / 18</p>
            <p>正文 16 / 15，行高 1.65。等宽数字用于金额与编号。</p>
            <p class="paper-meta">Meta 12 / 11 · 字距 0.02em</p>
            <p class="paper-mono pv-code">978-7-111-54493-7</p>
          </PaperStack>
        </PaperCell>
        <PaperCell :span="5">
          <PaperStack :gap="3">
            <p class="paper-meta">色板</p>
            <div class="pv-swatches">
              <span class="pv-swatch" style="background: var(--paper)"></span>
              <span class="pv-swatch" style="background: var(--paper-deep)"></span>
              <span class="pv-swatch" style="background: var(--ink)"></span>
              <span class="pv-swatch" style="background: var(--green)"></span>
              <span class="pv-swatch" style="background: var(--green-mid)"></span>
              <span class="pv-swatch" style="background: var(--orange)"></span>
              <span class="pv-swatch" style="background: var(--gold)"></span>
              <span class="pv-swatch" style="background: var(--line)"></span>
            </div>
            <p class="paper-meta">噪声浓度 --noise-opacity 默认 0.055</p>
            <PaperStack direction="horizontal" :gap="3">
              <PaperCard tone="paper" noise padding="sm" class="pv-noise-demo">
                <span class="paper-meta">faint</span>
              </PaperCard>
              <PaperCard tone="paper" noise padding="sm" class="pv-noise-demo">
                <span class="paper-meta">default</span>
              </PaperCard>
              <PaperCard tone="ink" noise padding="sm" class="pv-noise-demo">
                <span class="paper-meta pv-meta-inverse">inverse</span>
              </PaperCard>
            </PaperStack>
          </PaperStack>
        </PaperCell>
      </PaperGrid>
    </section>

    <PaperRule :space="8" ink weight="heavy" />

    <section class="pv-section">
      <div class="pv-head">
        <span class="pv-no paper-mono">02</span>
        <h2>按钮与表单</h2>
      </div>
      <PaperGrid>
        <PaperCell :span="6">
          <PaperStack :gap="5">
            <PaperStack direction="horizontal" :gap="3" align="center">
              <PaperButton variant="solid">主行动</PaperButton>
              <PaperButton>描边</PaperButton>
              <PaperButton size="sm">小尺寸</PaperButton>
              <PaperButton variant="ghost">行内</PaperButton>
            </PaperStack>
            <PaperStack direction="horizontal" :gap="3" align="center">
              <PaperButton disabled>禁用</PaperButton>
              <PaperButton variant="solid" loading>提交中</PaperButton>
            </PaperStack>
            <PaperButton block variant="solid">撑满宽度</PaperButton>
            <PaperStack direction="horizontal" :gap="5" align="center">
              <PaperCheckbox v-model="agree" label="同意条款" hint="辅助说明" />
              <PaperCheckbox :model-value="false" indeterminate label="全选" />
              <PaperCheckbox :model-value="false" disabled label="失效" />
            </PaperStack>
            <PaperStack direction="horizontal" :gap="5" align="center">
              <PaperRadio v-model="condition" name="c" value="a" label="选项一" />
              <PaperRadio v-model="condition" name="c" value="b" label="选项二" />
              <PaperRadio v-model="condition" name="c" value="c" label="选项三" />
            </PaperStack>
          </PaperStack>
        </PaperCell>
        <PaperCell :span="6">
          <PaperStack :gap="5">
            <PaperInput v-model="title" label="名称" placeholder="输入名称" note="最多 40 字" :maxlength="40" />
            <PaperInput v-model="isbn" label="编号" mono hint="支持等宽数字" />
            <PaperInput v-model="price" label="金额" type="number" mono error="取值超出范围" />
            <PaperSelect
              v-model="semester"
              label="选择项"
              placeholder="未选择"
              :options="[
                { value: 'a', label: '选项 A' },
                { value: 'b', label: '选项 B' },
                { value: 'c', label: '选项 C', disabled: true },
              ]"
            />
            <PaperInput v-model="note" label="多行输入" :rows="3" hint="支持 textarea" />
          </PaperStack>
        </PaperCell>
      </PaperGrid>
    </section>

    <PaperRule :space="8" ink weight="heavy" />

    <section class="pv-section">
      <div class="pv-head">
        <span class="pv-no paper-mono">03</span>
        <h2>色块与构图</h2>
      </div>

      <PaperComposition layout="stack" divider="mid" divider-tone="orange" class="pv-comp">
        <PaperStack :gap="5">
          <PaperComposition layout="offset" ratio="1fr 1fr">
            <PaperSlab tone="deep" padding="md" noise bar="green">
              <PaperStack :gap="3">
                <span class="paper-meta">PaperSlab · deep</span>
                <p>带顶部色条与纸噪的色块容器，可整块斜切。</p>
                <PaperStack direction="horizontal" :gap="2">
                  <PaperTag tone="quiet">直角</PaperTag>
                  <PaperTag tone="gold">gold</PaperTag>
                </PaperStack>
              </PaperStack>
            </PaperSlab>
            <PaperSlab tone="green" padding="md" noise slant>
              <PaperStack :gap="3">
                <span class="pv-meta-inverse">PaperSlab · green + slant</span>
                <p class="pv-inverse">clip-path 斜切右侧，不占额外宽度。</p>
              </PaperStack>
            </PaperSlab>
          </PaperComposition>

          <PaperComposition layout="diagonal" ratio="1fr 1fr">
            <PaperSlab tone="ink" padding="lg" noise>
              <PaperMega text="AA" tone="paper" />
            </PaperSlab>
            <PaperSlab tone="orange" padding="lg">
              <PaperMega text="KT" tone="paper" orientation="horizontal" />
            </PaperSlab>
          </PaperComposition>
        </PaperStack>
      </PaperComposition>

      <PaperStack :gap="4" class="pv-after">
        <p class="paper-meta">PaperMega 变体</p>
        <PaperStack direction="horizontal" :gap="6" align="end">
          <PaperMega text="BOLD" tone="ink" offset />
          <PaperMega text="OUT" tone="outline" />
          <PaperMega text="V" tone="orange" orientation="vertical" />
        </PaperStack>
      </PaperStack>
    </section>

    <PaperRule :space="8" ink weight="heavy" />

    <section class="pv-section">
      <div class="pv-head">
        <span class="pv-no paper-mono">04</span>
        <h2>数据展示</h2>
      </div>
      <PaperStack :gap="6">
        <PaperStatGroup :columns="4" ruled>
          <PaperStat value="128" label="在售" unit="本" />
          <PaperStat value="46" label="成交" unit="单" />
          <PaperStat value="¥ 32" label="均价" />
          <PaperStat value="2.4" label="平均流转" unit="次" />
        </PaperStatGroup>

        <div>
          <PaperTabs v-model="tab" :tabs="tabs" />
          <div class="pv-tabpanel">
            <p v-if="tab === 'onsale'">在售 12 条，最近更新于今天。</p>
            <p v-else-if="tab === 'ordered'">3 单待处理。</p>
            <p v-else>已完成订单进入历史。</p>
          </div>
        </div>

        <PaperTable :columns="columns" :rows="rows" ruled />
      </PaperStack>
    </section>

    <PaperRule :space="8" ink weight="heavy" />

    <section class="pv-section">
      <div class="pv-head">
        <span class="pv-no paper-mono">05</span>
        <h2>时间轴与图片</h2>
      </div>
      <PaperGrid>
        <PaperCell :span="8">
          <PaperCard tone="paper" padding="lg" noise>
            <template #header>
              <h3>流转记录</h3>
              <span class="paper-mono pv-price">¥ 26</span>
            </template>
            <PaperTimeline :items="chain" />
          </PaperCard>
        </PaperCell>
        <PaperCell :span="4">
          <PaperStack :gap="5">
            <p class="paper-meta">PaperFigure 三种形状</p>
            <PaperStack direction="horizontal" :gap="4" align="start">
              <PaperFigure shape="round" size="100px" fallback="圆" />
              <PaperFigure fallback="方" style="max-width: 92px" />
              <PaperFigure shape="slant" fallback="斜" style="max-width: 92px" />
            </PaperStack>
            <PaperRule ink />
            <PaperStack direction="horizontal" :gap="3" align="center">
              <PaperFigure shape="round" size="48px" fallback="缩" />
              <PaperStack :gap="1">
                <span class="pv-name">正圆是唯一例外</span>
                <span class="paper-meta">控件一律直角</span>
              </PaperStack>
            </PaperStack>
          </PaperStack>
        </PaperCell>
      </PaperGrid>
    </section>

    <PaperRule :space="8" ink weight="heavy" />

    <section class="pv-section">
      <div class="pv-head">
        <span class="pv-no paper-mono">06</span>
        <h2>反馈层</h2>
      </div>
      <PaperGrid>
        <PaperCell :span="4">
          <PaperEmpty title="暂无内容" description="空态由标题、说明与可选动作组成。" ruled>
            <PaperButton size="sm" variant="solid">新建</PaperButton>
          </PaperEmpty>
        </PaperCell>
        <PaperCell :span="4">
          <PaperCard tone="paper" padding="md" noise>
            <PaperStack :gap="3">
              <PaperSkeleton width="40%" height="1.4em" />
              <PaperSkeleton :lines="3" height="0.9em" />
              <PaperSkeleton width="120px" height="2.2em" />
            </PaperStack>
          </PaperCard>
        </PaperCell>
        <PaperCell :span="4">
          <PaperStack :gap="4">
            <p class="paper-meta">PaperBadge</p>
            <PaperStack direction="horizontal" :gap="3" align="center">
              <PaperBadge :count="3" />
              <PaperBadge :count="128" />
              <PaperBadge dot tone="orange" />
              <PaperBadge dot tone="gold" />
            </PaperStack>
            <PaperRule />
            <PaperStack direction="horizontal" :gap="2">
              <PaperTag tone="quiet">quiet</PaperTag>
              <PaperTag tone="mid">mid</PaperTag>
              <PaperTag tone="strong">strong</PaperTag>
              <PaperTag tone="gold">gold</PaperTag>
            </PaperStack>
          </PaperStack>
        </PaperCell>
      </PaperGrid>
    </section>

    <PaperRule :space="8" ink weight="heavy" />

    <footer class="pv-foot">
      <PaperStack direction="horizontal" :gap="3" align="center">
        <span class="pv-bar" aria-hidden="true"></span>
        <p class="paper-meta">paper-ui · 直角 · 纸噪 · 构成主义</p>
      </PaperStack>
    </footer>
  </PaperContainer>

  <PaperDialog
    v-model:open="dialogOpen"
    title="确认操作"
    description="面板可叠加纸噪，顶部可选色条。"
    size="sm"
    noise
    ruled
    confirm-text="确认"
    cancel-text="取消"
    :loading="dialogLoading"
    @confirm="confirmDialog"
  >
    <PaperStack :gap="3">
      <PaperStack direction="horizontal" :gap="3" align="center">
        <PaperFigure shape="round" size="48px" fallback="示" />
        <PaperStack :gap="1">
          <span class="pv-name">示例条目</span>
          <span class="paper-meta">说明文字</span>
        </PaperStack>
      </PaperStack>
      <PaperRule />
      <PaperInput label="备注" placeholder="可填可不填" :rows="2" />
      <PaperCheckbox :model-value="true" label="确认项" hint="辅助说明" />
    </PaperStack>
  </PaperDialog>

  <PaperToast />
</template>

<style scoped>
.pv-hero {
  padding-block: var(--space-8) var(--space-6);
}

.pv-hero__mega {
  margin-bottom: var(--space-5);
}

.pv-hero__title {
  font-size: var(--text-display);
}

.pv-eyebrow {
  font-size: var(--text-meta);
  letter-spacing: 0.06em;
  color: var(--ink-soft);
}

.pv-lede {
  color: var(--ink-soft);
  max-width: 52ch;
}

.pv-section {
  padding-block: var(--space-6);
}

.pv-head {
  display: flex;
  align-items: baseline;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.pv-no {
  font-size: var(--text-meta);
  color: var(--orange);
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

.pv-code {
  font-size: var(--text-body);
  letter-spacing: 0.04em;
}

.pv-swatches {
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  border: var(--line-hair) solid var(--line);
}

.pv-swatch {
  height: 40px;
}

.pv-noise-demo {
  flex: 1;
  min-width: 0;
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

.pv-slab-note,
.pv-inverse {
  color: color-mix(in srgb, var(--paper) 82%, transparent);
}

.pv-meta-inverse {
  font-size: var(--text-meta);
  letter-spacing: var(--tracking-meta);
  color: color-mix(in srgb, var(--paper) 72%, transparent);
}

.pv-comp {
  margin-bottom: var(--space-6);
}

.pv-after {
  margin-top: var(--space-6);
}

.pv-foot {
  padding-block: var(--space-6) var(--space-9);
}

.pv-bar {
  display: block;
  width: var(--bar-mega);
  height: var(--bar-thin);
  background-color: var(--orange);
}

@media (max-width: 640px) {
  .pv-swatches {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
