<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-[var(--color-border)]">
          <th
            v-for="col in columns"
            :key="col.key"
            class="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide cursor-pointer select-none"
            :class="{ 'hover:text-[var(--color-text)]': col.sortable }"
            @click="col.sortable && emit('sort', col.key)"
          >
            <span class="flex items-center gap-1">
              {{ col.label }}
              <span v-if="col.sortable && sortBy === col.key" class="text-[var(--color-primary)]">
                {{ sortDir === 'asc' ? '↑' : '↓' }}
              </span>
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="rows.length === 0">
          <td :colspan="columns.length" class="px-4 py-10 text-center text-[var(--color-text-muted)]">
            No data found
          </td>
        </tr>
        <tr
          v-for="row in rows"
          :key="row.id"
          class="border-b border-[var(--color-border)]/50 hover:bg-[var(--color-surface-2)]/40 transition-colors"
        >
          <slot :row="row" />
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div v-if="(totalPages ?? 0) > 1" class="flex items-center justify-between px-4 py-3 border-t border-[var(--color-border)]">
      <span class="text-xs text-[var(--color-text-muted)]">
        Page {{ page }} of {{ totalPages }} · {{ total }} total
      </span>
      <div class="flex gap-2">
        <button
          :disabled="(page ?? 1) <= 1"
          class="px-3 py-1 text-xs rounded bg-[var(--color-surface-2)] disabled:opacity-40 hover:bg-[var(--color-border)] transition-colors"
          @click="emit('page', (page ?? 1) - 1)"
        >
          Prev
        </button>
        <button
          :disabled="(page ?? 1) >= (totalPages ?? 1)"
          class="px-3 py-1 text-xs rounded bg-[var(--color-surface-2)] disabled:opacity-40 hover:bg-[var(--color-border)] transition-colors"
          @click="emit('page', (page ?? 1) + 1)"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends { id: string }">
export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
}

defineProps<{
  columns: TableColumn[]
  rows: T[]
  total?: number
  page?: number
  totalPages?: number
  sortBy?: string
  sortDir?: 'asc' | 'desc'
}>()

const emit = defineEmits<{
  sort: [key: string]
  page: [page: number]
}>()
</script>
