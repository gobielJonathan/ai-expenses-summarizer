<template>
  <VisSingleContainer :data="data" :height="height">
    <VisDonut :value="valueAccessor" :arcWidth="arcWidth" />
    <VisTooltip :triggers="tooltipTriggers" />
  </VisSingleContainer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { VisSingleContainer, VisDonut, VisTooltip } from '@unovis/vue'
import { Donut } from '@unovis/ts'

interface DataPoint {
  label: string
  value: number
}

const props = withDefaults(defineProps<{
  data: DataPoint[]
  height?: number
  arcWidth?: number
}>(), {
  height: 220,
  arcWidth: 60,
})

const valueAccessor = (d: DataPoint) => d.value

const tooltipTriggers = computed(() => ({
  [Donut.selectors.segment]: (d: DataPoint) => `${d.label}: ${d.value.toLocaleString('id-ID')}`,
}))
</script>
