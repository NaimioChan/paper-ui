<script setup lang="ts">
export interface PaperTableColumn {
  key: string
  title: string
  /** 列宽，例如 '120px' 或 '1fr'；缺省按内容自适应 */
  width?: string
  /** 数值列右对齐并启用等宽字 */
  numeric?: boolean
  /** 表头与单元格的水平对齐 */
  align?: 'start' | 'center' | 'end'
}

withDefaults(
  defineProps<{
    columns: readonly PaperTableColumn[]
    /** 行数据，字段以 key 对应；需要自定义渲染时用同名插槽 */
    rows: readonly Record<string, unknown>[]
    /** 行唯一键字段名 */
    rowKey?: string
    /** 紧凑行高，管理端列表用 */
    dense?: boolean
    /** 加载中显示骨架行 */
    loading?: boolean
    loadingRows?: number
    /** 表头吸顶 */
    stickyHead?: boolean
    /** 斑马纹：偶数行用深纸黄底 */
    striped?: boolean
    /** 反色表头：墨底纸黄字 */
    ruled?: boolean
    /** 空态文案 */
    emptyText?: string
  }>(),
  { rowKey: 'id', dense: false, loading: false, loadingRows: 4, stickyHead: false, striped: false, ruled: false, emptyText: '暂无数据' },
)

function cellValue(row: Record<string, unknown>, key: string): string {
  const value = row[key]
  if (value === null || value === undefined) return ''
  return String(value)
}

function rowId(row: Record<string, unknown>, key: string, index: number): string {
  const value = row[key]
  return value === undefined || value === null ? `row-${index}` : String(value)
}
</script>

<template>
  <div class="paper-table__wrap" :class="{ 'paper-table__wrap--sticky': stickyHead }">
    <table class="paper-table" :class="{ 'paper-table--dense': dense, 'paper-table--striped': striped, 'paper-table--ruled': ruled }">
      <colgroup>
        <col v-for="column in columns" :key="column.key" :style="column.width ? { width: column.width } : undefined" />
      </colgroup>
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            scope="col"
            :class="[`paper-table__cell--${column.align ?? (column.numeric ? 'end' : 'start')}`]"
          >
            {{ column.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-if="loading">
          <tr v-for="row in loadingRows" :key="`skeleton-${row}`" class="paper-table__row--skeleton">
            <td v-for="column in columns" :key="column.key">
              <span class="paper-table__skeleton"></span>
            </td>
          </tr>
        </template>
        <template v-else-if="rows.length === 0">
          <tr>
            <td :colspan="columns.length" class="paper-table__empty">{{ emptyText }}</td>
          </tr>
        </template>
        <template v-else>
          <tr v-for="(row, index) in rows" :key="rowId(row, rowKey, index)">
            <td
              v-for="column in columns"
              :key="column.key"
              :class="[
                `paper-table__cell--${column.align ?? (column.numeric ? 'end' : 'start')}`,
                { 'paper-table__cell--numeric': column.numeric },
              ]"
            >
              <slot :name="column.key" :row="row" :index="index" :value="row[column.key]">
                {{ cellValue(row, column.key) }}
              </slot>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<style src="../styles/components/paper-table.css"></style>
