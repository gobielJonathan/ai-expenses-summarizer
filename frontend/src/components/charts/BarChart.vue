<template>
  <VisXYContainer :data="data" :height="height">
    <VisGroupedBar :x="xAccessor" :y="yAccessors" :roundedCorners="4" :color="colorFn" />
    <VisAxis type="x" :tickFormat="xTickFormat" :gridLine="false" />
    <VisAxis type="y" :tickFormat="yTickFormat" :gridLine="false" />
    <VisTooltip :triggers="tooltipTriggers" />
  </VisXYContainer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  VisXYContainer,
  VisGroupedBar,
  VisAxis,
  VisTooltip,
} from '@unovis/vue'
import { GroupedBar } from '@unovis/ts'

interface DataPoint {
  x: string | number
  [key: string]: unknown
}

const props = withDefaults(defineProps<{
  data: DataPoint[]
  yKeys: string[]
  colors?: string[]
  height?: number
  xTickFormat?: (v: unknown, i: number) => string
  yTickFormat?: (v: unknown, i: number) => string
}>(), {
  height: 220,
  colors: () => ['var(--color-primary)', '#22c55e', '#f59e0b', '#ef4444'],
  xTickFormat: (v: unknown, _i: number) => String(v),
  yTickFormat: (v: unknown, _i: number) => {
    const n = Number(v)
    return n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : String(n)
  },
})

const xAccessor = (_d: DataPoint, i: number) => i
const yAccessors = computed(() => props.yKeys.map((k) => (d: DataPoint) => Number(d[k] ?? 0)))
const colorFn = (_d: DataPoint, i: number) => props.colors[i % props.colors.length]

const tooltipTriggers = computed(() => ({
  [GroupedBar.selectors.bar]: (d: DataPoint) =>
    props.yKeys.map((k) => `${k}: ${d[k]}`).join('<br/>'),
}))
</script>
