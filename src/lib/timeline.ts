/** 时间轴节点。业务语义由调用方决定，库只关心排列与当前项。 */
export interface PaperTimelineItem {
  id: string
  /** 左侧标签，通常是学期或日期 */
  when?: string
  /** 主标题，例如出让人与受让人的昵称 */
  title: string
  /** 次要说明 */
  meta?: string
  /** 金额文本，由调用方格式化，库不做货币换算 */
  price?: string
  /** 显式标记当前节点；不标记时默认最后一项为当前 */
  current?: boolean
}

export interface ResolvedTimelineNode extends PaperTimelineItem {
  index: number
  /** 是否为渲染后认定的当前节点 */
  isCurrent: boolean
  /** 上方连线是否存在 */
  lineAbove: boolean
  /** 下方连线是否存在 */
  lineBelow: boolean
}

/**
 * 解析时间轴：确定当前节点并计算连线。
 * 规则：
 * - 有显式 current 时取第一个标记项；
 * - 无显式标记时最后一项为当前节点；
 * - 空数组返回空数组，单项时上下都不连线。
 */
export function resolveTimeline(items: readonly PaperTimelineItem[]): ResolvedTimelineNode[] {
  if (items.length === 0) return []

  const explicit = items.findIndex((item) => item.current === true)
  const currentIndex = explicit >= 0 ? explicit : items.length - 1

  return items.map((item, index) => ({
    ...item,
    index,
    isCurrent: index === currentIndex,
    lineAbove: index > 0,
    lineBelow: index < items.length - 1,
  }))
}
