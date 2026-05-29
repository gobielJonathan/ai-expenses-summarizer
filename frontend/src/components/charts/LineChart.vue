<template>
  <VisXYContainer :data="data" :height="height">
    <VisLine :x="xAccessor" :y="yAccessor" color="var(--color-primary)" />
    <VisAxis type="x" :tickFormat="xTickFormat" :numTicks="numTicks" :gridLine="false" />
    <VisAxis type="y" :tickFormat="yTickFormat" :gridLine="false" />
    <VisCrosshair :template="tooltipTemplate" />
    <VisTooltip />
  </VisXYContainer>
</template>

<script setup lang="ts">
import {
  VisXYContainer,
  VisLine,
  VisAxis,
  VisCrosshair,
  VisTooltip,
} from '@unovis/vue'

interface DataPoint {
  x: string | number
  y: number
}

const props = withDefaults(defineProps<{
  data: DataPoint[]
  height?: number
  numTicks?: number
  xTickFormat?: (v: unknown, i: number) => string
  yTickFormat?: (v: unknown, i: number) => string
  tooltipTemplate?: (d: DataPoint) => string
}>(), {
  height: 220,
  numTicks: undefined,
  xTickFormat: (v: unknown, _i: number) => String(v),
  yTickFormat: (v: unknown, _i: number) => {
    const n = Number(v)
    return n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(0)}K` : String(n)
  },
})

const xAccessor = (_d: DataPoint, i: number) => i
const yAccessor = (d: DataPoint) => d.y
const tooltipTemplate = props.tooltipTemplate ?? ((d: DataPoint) => `${d.x}: ${d.y}`)
</script>
