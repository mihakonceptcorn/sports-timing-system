<template>
  <nav aria-label="Breadcrumb" class="mb-4">
    <ol class="flex items-center flex-wrap gap-1.5 text-sm">
      <li class="inline-flex items-center">
        <router-link
          :to="{ name: 'competitions' }"
          class="inline-flex items-center gap-1.5 font-medium text-surface-500 hover:text-primary-600 dark:text-surface-400 dark:hover:text-primary-400 transition-colors"
        >
          <i class="pi pi-home text-xs"></i>
          <span>{{ homeLabel }}</span>
        </router-link>
      </li>

      <template v-for="(item, index) in items" :key="index">
        <li class="inline-flex items-center text-surface-400 dark:text-surface-600 select-none">
          <i class="pi pi-chevron-right text-[10px]"></i>
        </li>
        <li class="inline-flex items-center max-w-[200px] sm:max-w-[320px] truncate">
          <router-link
            v-if="item.to && index < items.length - 1"
            :to="item.to"
            class="font-medium text-surface-600 hover:text-primary-600 dark:text-surface-300 dark:hover:text-primary-400 transition-colors truncate"
            :title="item.label"
          >
            {{ item.label }}
          </router-link>
          <span
            v-else
            class="font-semibold text-surface-900 dark:text-surface-0 truncate"
            :title="item.label"
          >
            {{ item.label }}
          </span>
        </li>
      </template>
    </ol>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})

const { locale } = useI18n()

const homeLabel = computed(() => {
  return locale.value === 'ua' ? 'Змагання' : 'Competitions'
})
</script>

