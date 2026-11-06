<template>
  <div class="competition-results w-full pb-10">
    <!-- Top action bar -->
    <div class="flex items-center justify-between mb-4 flex-wrap gap-2 no-print">
      <Button
        @click.prevent="goBack"
        label="Go Back"
        icon="pi pi-arrow-left"
        severity="secondary"
      />

      <div class="flex items-center gap-2">
        <span class="inline-flex items-center text-xs text-green-600 dark:text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full font-medium">
          <span class="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
          Live Sync
        </span>
        <Button
          @click.prevent="printResults"
          label="Print"
          icon="pi pi-print"
          severity="secondary"
          outlined
        />
      </div>
    </div>

    <!-- Competition Title & Info Card -->
    <Card class="mb-6">
      <template #content>
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-3 flex-wrap">
              <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-0">
                {{ competition?.name || 'Tournament Results' }}
              </h2>
              <Tag
                :value="competitionTypeLabel(competitionType, { short: true, locale })"
                severity="info"
                class="text-xs uppercase font-bold"
              />
            </div>
            <p class="text-sm text-surface-500 dark:text-surface-400 mt-1 flex items-center gap-4 flex-wrap">
              <span v-if="competition?.location || competition?.city">
                <i class="pi pi-map-marker mr-1 text-red-500"></i>
                {{ [competition?.location, competition?.city, competition?.country].filter(Boolean).join(', ') }}
              </span>
              <span v-if="competition?.date">
                <i class="pi pi-calendar mr-1 text-blue-500"></i>
                {{ formatDate(competition?.date) }}
              </span>
            </p>
          </div>

          <!-- Quick summary badges -->
          <div class="flex items-center gap-2 flex-wrap">
            <div class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg px-3 py-2 text-center min-w-20">
              <div class="text-xs text-surface-500 dark:text-surface-400 font-semibold uppercase">Stages</div>
              <div class="text-lg font-bold text-surface-900 dark:text-surface-0">{{ sortedStages.length }}</div>
            </div>
            <div class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg px-3 py-2 text-center min-w-20">
              <div class="text-xs text-surface-500 dark:text-surface-400 font-semibold uppercase">Riders</div>
              <div class="text-lg font-bold text-primary">{{ totalRidersCount }}</div>
            </div>
            <div class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg px-3 py-2 text-center min-w-20">
              <div class="text-xs text-surface-500 dark:text-surface-400 font-semibold uppercase">Finished</div>
              <div class="text-lg font-bold text-green-600 dark:text-green-400">{{ finishedRidersCount }}</div>
            </div>
          </div>
        </div>

        <!-- Format Explanation Banner -->
        <div class="mt-4 pt-3 border-t border-surface-200 dark:border-surface-700 text-xs text-surface-500 dark:text-surface-400 flex items-center justify-between flex-wrap gap-2">
          <div>
            <span class="font-semibold text-surface-700 dark:text-surface-200">Format:</span> {{ formatDescription }}
          </div>
          <div v-if="isLastStageCompleted" class="text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
            <i class="pi pi-check-circle"></i> Усі етапи завершено
          </div>
        </div>
      </template>
    </Card>

    <!-- Toolbar: Filters & Options -->
    <Card class="mb-6 no-print">
      <template #content>
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-4 flex-wrap">
            <div class="flex items-center gap-2">
              <label for="categoryFilter" class="text-xs font-semibold uppercase text-surface-600 dark:text-surface-300">
                Категорія:
              </label>
              <Select
                id="categoryFilter"
                v-model="selectedCategory"
                :options="categoryOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Оберіть категорію"
                class="w-56"
              />
            </div>

            <!-- Qualifying + Final Sub-tabs -->
            <div v-if="competitionType === COMPETITION_TYPE.QUALIFYING_FINAL" class="flex items-center gap-1 bg-surface-100 dark:bg-surface-800 p-1 rounded-lg">
              <Button
                size="small"
                :severity="selectedQfMode === 'overall' ? 'primary' : 'secondary'"
                :variant="selectedQfMode === 'overall' ? undefined : 'text'"
                label="Підсумковий залік"
                @click="selectedQfMode = 'overall'"
              />
              <Button
                size="small"
                :severity="selectedQfMode === 'final' ? 'primary' : 'secondary'"
                :variant="selectedQfMode === 'final' ? undefined : 'text'"
                label="Фінал"
                @click="selectedQfMode = 'final'"
              />
              <Button
                size="small"
                :severity="selectedQfMode === 'qualifying' ? 'primary' : 'secondary'"
                :variant="selectedQfMode === 'qualifying' ? undefined : 'text'"
                label="Кваліфікація"
                @click="selectedQfMode = 'qualifying'"
              />
            </div>
          </div>

          <!-- Search -->
          <div class="w-full md:w-64">
            <IconField iconPosition="left">
              <InputIcon class="pi pi-search" />
              <InputText
                v-model="searchQuery"
                placeholder="Пошук райдера або №..."
                class="w-full"
              />
            </IconField>
          </div>
        </div>
      </template>
    </Card>

    <!-- Empty State -->
    <Card v-if="visibleCategoryGroups.length === 0" class="text-center py-8">
      <template #content>
        <div class="flex flex-col items-center justify-center text-surface-500 py-6">
          <i class="pi pi-stopwatch text-5xl mb-3 text-surface-400"></i>
          <h3 class="text-lg font-bold text-surface-800 dark:text-surface-100">Немає результатів</h3>
          <p class="text-sm text-surface-500 dark:text-surface-400 max-w-md mt-1">
            Результати з'являться тут автоматично, щойно учасники фінішують на трасі або будуть додані до етапів.
          </p>
          <Button
            @click.prevent="goBack"
            label="Повернутися до змагання"
            icon="pi pi-arrow-left"
            class="mt-4"
            size="small"
          />
        </div>
      </template>
    </Card>

    <!-- Category Tables: Each category has its own separate table -->
    <div v-else class="flex flex-col gap-6">
      <Card
        v-for="group in visibleCategoryGroups"
        :key="group.key"
        class="category-card"
      >
        <template #title>
          <div class="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-surface-200 dark:border-surface-700">
            <div class="flex items-center gap-2">
              <span class="text-lg font-bold text-surface-900 dark:text-surface-0 uppercase tracking-wide">
                {{ group.categoryName }}
              </span>
              <Tag
                :value="`${group.finishersCount} / ${group.totalCount} фінішували`"
                :severity="group.finishersCount > 0 ? 'success' : 'secondary'"
                class="text-xs font-normal"
              />
            </div>

            <div v-if="group.leader" class="text-xs text-surface-500 dark:text-surface-400 flex items-center gap-2">
              <span>Лідер:</span>
              <span class="font-bold text-surface-900 dark:text-surface-0">{{ group.leader.fullName }}</span>
              <span class="font-mono font-bold text-primary">({{ group.leader.resultTime }})</span>
            </div>
          </div>
        </template>

        <template #content>
          <DataTable
            :value="getFilteredGroupRows(group)"
            dataKey="key"
            tableStyle="min-width: 45rem"
            responsiveLayout="scroll"
            class="mt-2"
          >
            <!-- Position Column -->
            <Column header="Place" headerClass="w-20 text-center">
              <template #body="{ data }">
                <div class="flex items-center justify-center font-bold">
                  <span v-if="data.place === 1" class="text-base font-bold text-amber-500">
                    🥇 1
                  </span>
                  <span v-else-if="data.place === 2" class="text-base font-bold text-slate-400">
                    🥈 2
                  </span>
                  <span v-else-if="data.place === 3" class="text-base font-bold text-amber-700 dark:text-amber-500">
                    🥉 3
                  </span>
                  <span v-else-if="data.place" class="font-semibold text-surface-800 dark:text-surface-100">
                    {{ data.place }}
                  </span>
                  <Tag
                    v-else
                    :value="data.status || 'DNS'"
                    :severity="data.status?.includes('DNF') ? 'danger' : 'secondary'"
                    class="text-xs"
                  />
                </div>
              </template>
            </Column>

            <!-- Bib Number Column -->
            <Column field="competitorNumber" header="№" headerClass="w-16 text-center">
              <template #body="{ data }">
                <div class="text-center font-mono font-bold text-surface-800 dark:text-surface-100">
                  {{ data.competitorNumber ?? '—' }}
                </div>
              </template>
            </Column>

            <!-- Rider Name & Team -->
            <Column field="fullName" header="Rider">
              <template #body="{ data }">
                <div class="font-medium text-surface-900 dark:text-surface-0 leading-tight">
                  {{ data.fullName }}
                </div>
                <div v-if="data.team" class="text-xs text-surface-500 dark:text-surface-400 truncate max-w-56 mt-0.5">
                  {{ data.team }}
                </div>
              </template>
            </Column>

            <!-- ================= SINGLE RUN FORMAT ================= -->
            <template v-if="competitionType === COMPETITION_TYPE.SINGLE_RUN">
              <Column header="Time" field="resultTime" headerClass="text-right w-32">
                <template #body="{ data }">
                  <div class="font-mono font-bold text-primary text-right text-base">
                    {{ data.resultTime }}
                  </div>
                </template>
              </Column>
              <Column header="Gap" field="gapFormatted" headerClass="text-right w-28">
                <template #body="{ data }">
                  <div
                    class="font-mono text-sm text-right"
                    :class="data.gapFormatted === '0.00' ? 'font-bold text-green-600 dark:text-green-400' : 'text-surface-600 dark:text-surface-300'"
                  >
                    {{ data.gapFormatted }}
                  </div>
                </template>
              </Column>
            </template>

            <!-- ================= BEST OF N FORMAT ================= -->
            <template v-else-if="competitionType === COMPETITION_TYPE.BEST_OF_N">
              <Column
                v-for="stage in sortedStages"
                :key="stage.id"
                :header="stage.name || `Run ${stage.number}`"
                headerClass="text-center w-28"
              >
                <template #body="{ data }">
                  <div class="flex items-center justify-center">
                    <span
                      class="font-mono text-sm px-2 py-0.5 rounded"
                      :class="isAthleteBestRun(data, stage.id) ? 'font-bold bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 border border-green-300 dark:border-green-800 inline-flex items-center gap-1' : 'text-surface-700 dark:text-surface-300'"
                    >
                      {{ getStageTime(data, stage.id) }}
                      <i v-if="isAthleteBestRun(data, stage.id)" class="pi pi-star-fill text-amber-500 text-xs"></i>
                    </span>
                  </div>
                </template>
              </Column>

              <Column header="Best Time" field="resultTime" headerClass="text-right w-32">
                <template #body="{ data }">
                  <div class="font-mono font-bold text-primary text-right text-base">
                    {{ data.resultTime }}
                  </div>
                </template>
              </Column>

              <Column header="Gap" field="gapFormatted" headerClass="text-right w-28">
                <template #body="{ data }">
                  <div
                    class="font-mono text-sm text-right"
                    :class="data.gapFormatted === '0.00' ? 'font-bold text-green-600 dark:text-green-400' : 'text-surface-600 dark:text-surface-300'"
                  >
                    {{ data.gapFormatted }}
                  </div>
                </template>
              </Column>
            </template>

            <!-- ================= QUALIFYING + FINAL FORMAT ================= -->
            <template v-else-if="competitionType === COMPETITION_TYPE.QUALIFYING_FINAL">
              <template v-if="selectedQfMode === 'overall'">
                <Column header="Qualifying" headerClass="text-center w-32">
                  <template #body="{ data }">
                    <div class="font-mono text-sm text-center text-surface-700 dark:text-surface-300">
                      {{ data.qFormatted }}
                    </div>
                  </template>
                </Column>
                <Column header="Final" headerClass="text-center w-32">
                  <template #body="{ data }">
                    <div
                      class="font-mono font-semibold text-center"
                      :class="data.fRun?.status === 'FINISHED' ? 'text-primary' : 'text-surface-400'"
                    >
                      {{ data.fFormatted }}
                    </div>
                  </template>
                </Column>
                <Column header="Result" field="resultTime" headerClass="text-right w-32">
                  <template #body="{ data }">
                    <div class="font-mono font-bold text-primary text-right text-base">
                      {{ data.resultTime }}
                    </div>
                    <div v-if="data.note" class="text-xs text-surface-500 dark:text-surface-400 text-right">
                      {{ data.note }}
                    </div>
                  </template>
                </Column>
                <Column header="Gap" field="gapFormatted" headerClass="text-right w-28">
                  <template #body="{ data }">
                    <div
                      class="font-mono text-sm text-right"
                      :class="data.gapFormatted === '0.00' ? 'font-bold text-green-600 dark:text-green-400' : 'text-surface-600 dark:text-surface-300'"
                    >
                      {{ data.gapFormatted }}
                    </div>
                  </template>
                </Column>
              </template>

              <template v-else>
                <Column :header="selectedQfMode === 'final' ? 'Final Time' : 'Qualifying Time'" field="resultTime" headerClass="text-right w-32">
                  <template #body="{ data }">
                    <div class="font-mono font-bold text-primary text-right text-base">
                      {{ data.resultTime }}
                    </div>
                  </template>
                </Column>
                <Column header="Gap" field="gapFormatted" headerClass="text-right w-28">
                  <template #body="{ data }">
                    <div
                      class="font-mono text-sm text-right"
                      :class="data.gapFormatted === '0.00' ? 'font-bold text-green-600 dark:text-green-400' : 'text-surface-600 dark:text-surface-300'"
                    >
                      {{ data.gapFormatted }}
                    </div>
                  </template>
                </Column>
              </template>
            </template>

            <!-- ================= MULTI-STAGE / ENDURO FORMAT ================= -->
            <template v-else>
              <Column
                v-for="stage in sortedStages"
                :key="stage.id"
                :header="stage.name || `SS ${stage.number}`"
                headerClass="text-center w-28"
              >
                <template #body="{ data }">
                  <div class="font-mono text-sm text-center text-surface-700 dark:text-surface-300">
                    {{ getStageTime(data, stage.id) }}
                  </div>
                </template>
              </Column>

              <Column header="Total Time" field="resultTime" headerClass="text-right w-32">
                <template #body="{ data }">
                  <div class="font-mono font-bold text-primary text-right text-base">
                    {{ data.resultTime }}
                  </div>
                </template>
              </Column>

              <Column header="Gap" field="gapFormatted" headerClass="text-right w-28">
                <template #body="{ data }">
                  <div
                    class="font-mono text-sm text-right"
                    :class="data.gapFormatted === '0.00' ? 'font-bold text-green-600 dark:text-green-400' : 'text-surface-600 dark:text-surface-300'"
                  >
                    {{ data.gapFormatted }}
                  </div>
                </template>
              </Column>

              <Column header="Status" headerClass="text-center w-28">
                <template #body="{ data }">
                  <Tag
                    :value="data.status"
                    :severity="data.status === 'FINISHED' ? 'success' : (data.status?.includes('DNF') ? 'danger' : 'secondary')"
                    class="text-xs"
                  />
                </template>
              </Column>
            </template>
          </DataTable>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCompetitionsStore } from '@/stores/competitions'
import { useStagesStore } from '@/stores/stages'
import { useCompetitorsStore } from '@/stores/competitors'
import {
  COMPETITION_TYPE,
  competitionTypeLabel,
  getCompetitionType,
} from '@/constants/competitionTypes'
import { calculateResultsByCategory } from '@/utils/competitionResults'

const route = useRoute()
const router = useRouter()
const { locale } = useI18n()
const competitionsStore = useCompetitionsStore()
const stagesStore = useStagesStore()
const competitorsStore = useCompetitorsStore()

const competition = ref(null)
const rawCompetitors = ref([])
const selectedCategory = ref('all')
const selectedQfMode = ref('overall')
const searchQuery = ref('')
let unsubscribeCompetitors = null

const competitionType = computed(() => competition.value?.type || COMPETITION_TYPE.MULTI_STAGE)

const formatDescription = computed(() => {
  return getCompetitionType(competitionType.value, locale.value)?.description || 'Хронометраж заїздів'
})

const sortedStages = computed(() => {
  return [...stagesStore.stages].sort((a, b) => (Number(a.number) || 0) - (Number(b.number) || 0))
})

const isLastStageCompleted = computed(() => {
  if (!sortedStages.value.length || !rawCompetitors.value.length) return false
  const lastStage = sortedStages.value[sortedStages.value.length - 1]
  const lastStageCompetitors = rawCompetitors.value.filter((c) => c.stageId === lastStage.id)
  return lastStageCompetitors.length > 0 && lastStageCompetitors.every((c) => Boolean(c.finishTime) || c.started)
})

// Calculate all results grouped by category + overall
const calculatedData = computed(() => {
  return calculateResultsByCategory({
    competition: competition.value,
    stages: sortedStages.value,
    competitors: rawCompetitors.value,
    options: {
      locale: locale.value,
      qfMode: selectedQfMode.value,
    },
  })
})

// Build category filter options for dropdown
const categoryOptions = computed(() => {
  const options = [{ label: 'Усі категорії (окремі таблиці)', value: 'all' }]
  calculatedData.value.categories.forEach((cat) => {
    options.push({ label: cat.categoryName, value: cat.category })
  })
  if (calculatedData.value.categories.length > 1) {
    options.push({ label: 'Абсолютний залік (Overall Scratch)', value: 'overall' })
  }
  return options
})

// Determine which category groups to show
const visibleCategoryGroups = computed(() => {
  if (selectedCategory.value === 'all') {
    return calculatedData.value.categories
  }
  if (selectedCategory.value === 'overall') {
    return [calculatedData.value.overall]
  }
  const found = calculatedData.value.categories.find((c) => c.category === selectedCategory.value)
  return found ? [found] : calculatedData.value.categories
})

// Filter rows within each category table by search query
const getFilteredGroupRows = (group) => {
  let list = group.results || []
  if (searchQuery.value && searchQuery.value.trim() !== '') {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter((r) => {
      const numMatch = String(r.competitorNumber || '').toLowerCase().includes(q)
      const nameMatch = (r.fullName || '').toLowerCase().includes(q)
      const teamMatch = (r.team || '').toLowerCase().includes(q)
      return numMatch || nameMatch || teamMatch
    })
  }
  return list
}

const totalRidersCount = computed(() => {
  return calculatedData.value.overall.totalCount
})

const finishedRidersCount = computed(() => {
  return calculatedData.value.overall.finishersCount
})

const getStageTime = (athlete, stageId) => {
  const run = athlete.stageRuns?.[stageId]
  if (!run) return '—'
  if (run.status === 'FINISHED') return run.formattedTime
  if (run.status === 'DNF') return 'DNF'
  return '—'
}

const isAthleteBestRun = (athlete, stageId) => {
  return athlete.bestStageId === stageId && athlete.status === 'FINISHED'
}

const formatDate = (dateVal) => {
  if (!dateVal) return ''
  const d = new Date(dateVal)
  if (isNaN(d.getTime())) return String(dateVal)
  return d.toLocaleDateString()
}

const goBack = () => {
  router.push({ name: 'competition-preview', params: { id: route.params.id } })
}

const printResults = () => {
  window.print()
}

onMounted(async () => {
  const compId = route.params.id
  competition.value = await competitionsStore.getCompetitionById(compId)
  await stagesStore.getStages(compId)

  // Subscribe to all stages' competitors
  const stageIds = stagesStore.stages.map((s) => s.id)
  unsubscribeCompetitors = competitorsStore.subscribeToCompetitionCompetitors(stageIds, (list) => {
    rawCompetitors.value = list
  })
})

onUnmounted(() => {
  if (unsubscribeCompetitors) {
    unsubscribeCompetitors()
    unsubscribeCompetitors = null
  }
})
</script>

<style scoped>
@media print {
  .no-print {
    display: none !important;
  }
  .category-card {
    page-break-inside: avoid;
    box-shadow: none !important;
    border: none !important;
  }
}
</style>
