<template>
  <div class="competition-results w-full pb-10">
    <!-- Top action bar (hidden during print) -->
    <div class="flex items-center justify-between mb-4 flex-wrap gap-2 no-print">
      <Button
        @click.prevent="goBack"
        label="Go Back"
        icon="pi pi-arrow-left"
        severity="secondary"
      />

      <div class="flex items-center gap-2">
        <span class="inline-flex items-center text-xs text-green-700 bg-green-100 px-2.5 py-1 rounded-full font-medium">
          <span class="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
          Live Sync
        </span>
        <Button
          @click.prevent="printResults"
          label="Print"
          icon="pi pi-print"
          severity="contrast"
          outlined
        />
      </div>
    </div>

    <!-- Competition Title & Info Card -->
    <Card class="mb-4 shadow-sm border border-gray-100">
      <template #content>
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
                {{ competition?.name || 'Tournament Results' }}
              </h1>
              <Tag
                :value="competitionTypeLabel(competitionType, { short: true, locale })"
                severity="info"
                class="text-sm font-semibold uppercase tracking-wider"
              />
            </div>
            <p class="text-sm text-gray-600 mt-1 flex items-center gap-3 flex-wrap">
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
          <div class="flex items-center gap-3 flex-wrap">
            <div class="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center min-w-24">
              <div class="text-xs text-gray-500 uppercase tracking-wider font-semibold">Stages</div>
              <div class="text-lg font-bold text-gray-800">{{ sortedStages.length }}</div>
            </div>
            <div class="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center min-w-24">
              <div class="text-xs text-gray-500 uppercase tracking-wider font-semibold">Riders</div>
              <div class="text-lg font-bold text-blue-600">{{ totalRidersCount }}</div>
            </div>
            <div class="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center min-w-24">
              <div class="text-xs text-gray-500 uppercase tracking-wider font-semibold">Finished</div>
              <div class="text-lg font-bold text-green-600">{{ finishedRidersCount }}</div>
            </div>
            <div v-if="leaderResult" class="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-left min-w-36">
              <div class="text-xs text-amber-700 uppercase tracking-wider font-semibold flex items-center gap-1">
                <i class="pi pi-trophy text-amber-500"></i> Leader
              </div>
              <div class="text-sm font-bold text-gray-900 truncate max-w-44">
                {{ leaderResult.fullName }}
              </div>
              <div class="text-xs font-mono font-semibold text-amber-900">
                {{ leaderResult.resultTime }}
              </div>
            </div>
          </div>
        </div>

        <!-- Format Explanation Banner -->
        <div class="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600 flex items-center justify-between flex-wrap gap-2">
          <div>
            <span class="font-semibold text-gray-700">Format:</span> {{ formatDescription }}
          </div>
          <div v-if="isLastStageCompleted" class="text-green-700 font-medium flex items-center gap-1">
            <i class="pi pi-check-circle"></i> Усі етапи завершено
          </div>
        </div>
      </template>
    </Card>

    <!-- Filters & View Mode (hidden during print) -->
    <Card class="mb-4 shadow-sm border border-gray-100 no-print">
      <template #content>
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <!-- Left: Category selector & QF Mode tabs -->
          <div class="flex items-center gap-3 flex-wrap">
            <div class="flex items-center gap-2">
              <label for="categoryFilter" class="text-xs font-semibold text-gray-700 uppercase">Category:</label>
              <Select
                id="categoryFilter"
                v-model="selectedCategory"
                :options="categoryOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select category"
                class="w-48 text-sm"
              />
            </div>

            <!-- Qualifying + Final Sub-tabs -->
            <div v-if="competitionType === COMPETITION_TYPE.QUALIFYING_FINAL" class="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              <Button
                size="small"
                :severity="selectedQfMode === 'overall' ? 'primary' : 'secondary'"
                :variant="selectedQfMode === 'overall' ? undefined : 'text'"
                label="Overall"
                @click="selectedQfMode = 'overall'"
              />
              <Button
                size="small"
                :severity="selectedQfMode === 'final' ? 'primary' : 'secondary'"
                :variant="selectedQfMode === 'final' ? undefined : 'text'"
                label="Final"
                @click="selectedQfMode = 'final'"
              />
              <Button
                size="small"
                :severity="selectedQfMode === 'qualifying' ? 'primary' : 'secondary'"
                :variant="selectedQfMode === 'qualifying' ? undefined : 'text'"
                label="Qualifying"
                @click="selectedQfMode = 'qualifying'"
              />
            </div>
          </div>

          <!-- Right: Search -->
          <div class="w-full md:w-64">
            <IconField iconPosition="left">
              <InputIcon class="pi pi-search" />
              <InputText
                v-model="searchQuery"
                placeholder="Search rider or #..."
                class="w-full text-sm"
              />
            </IconField>
          </div>
        </div>
      </template>
    </Card>

    <!-- Empty State -->
    <Card v-if="filteredResults.length === 0" class="shadow-sm border border-gray-100 text-center py-8">
      <template #content>
        <div class="flex flex-col items-center justify-center text-gray-500 py-6">
          <i class="pi pi-stopwatch text-5xl text-gray-300 mb-3"></i>
          <h3 class="text-lg font-bold text-gray-700">Немає результатів</h3>
          <p class="text-sm text-gray-500 max-w-md mt-1">
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

    <!-- Results Table -->
    <Card v-else class="shadow-sm border border-gray-100 print-clean">
      <template #content>
        <!-- Print Header -->
        <div class="print-header hidden mb-4 pb-2 border-b">
          <h2 class="text-2xl font-bold">{{ competition?.name }} — Results</h2>
          <p class="text-sm text-gray-600">
            {{ competitionTypeLabel(competitionType) }} | {{ [competition?.location, competition?.city].filter(Boolean).join(', ') }} | {{ formatDate(competition?.date) }}
          </p>
          <p v-if="selectedCategory !== 'all'" class="text-sm font-semibold mt-1">
            Category: {{ selectedCategory }}
          </p>
        </div>

        <DataTable
          :value="filteredResults"
          dataKey="key"
          tableStyle="min-width: 50rem"
          stripedRows
          class="results-datatable"
          responsiveLayout="scroll"
        >
          <!-- Place Column -->
          <Column field="displayPlace" header="Place" headerClass="w-20" :sortable="false">
            <template #body="{ data }">
              <div class="flex items-center justify-center font-bold">
                <span v-if="data.displayPlace === 1" class="medal gold" title="1st Place">
                  🥇 1
                </span>
                <span v-else-if="data.displayPlace === 2" class="medal silver" title="2nd Place">
                  🥈 2
                </span>
                <span v-else-if="data.displayPlace === 3" class="medal bronze" title="3rd Place">
                  🥉 3
                </span>
                <span v-else-if="data.displayPlace" class="text-gray-700 font-semibold px-2">
                  {{ data.displayPlace }}
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

          <!-- Number Column -->
          <Column field="competitorNumber" header="№" headerClass="w-16">
            <template #body="{ data }">
              <span class="font-mono font-bold px-2 py-0.5 bg-gray-100 rounded text-gray-800 text-sm">
                {{ data.competitorNumber ?? '—' }}
              </span>
            </template>
          </Column>

          <!-- Rider Name -->
          <Column field="fullName" header="Rider">
            <template #body="{ data }">
              <div class="font-semibold text-gray-900 leading-tight">
                {{ data.fullName }}
              </div>
              <div v-if="data.team" class="text-xs text-gray-500 truncate max-w-48">
                {{ data.team }}
              </div>
            </template>
          </Column>

          <!-- Category -->
          <Column field="category" header="Category" headerClass="w-28">
            <template #body="{ data }">
              <Tag
                v-if="data.category"
                :value="data.category"
                severity="contrast"
                class="text-xs uppercase"
              />
              <span v-else class="text-gray-400">—</span>
            </template>
          </Column>

          <!-- ================= SINGLE RUN FORMAT COLUMNS ================= -->
          <template v-if="competitionType === COMPETITION_TYPE.SINGLE_RUN">
            <Column header="Time" field="resultTime" headerClass="text-right w-32">
              <template #body="{ data }">
                <div class="font-mono font-bold text-gray-900 text-right text-base">
                  {{ data.resultTime }}
                </div>
              </template>
            </Column>
            <Column header="Gap" field="displayGap" headerClass="text-right w-28">
              <template #body="{ data }">
                <div class="font-mono text-sm text-right" :class="data.displayGap === '0.00' ? 'font-bold text-green-700' : 'text-gray-600'">
                  {{ data.displayGap }}
                </div>
              </template>
            </Column>
          </template>

          <!-- ================= BEST OF N FORMAT COLUMNS ================= -->
          <template v-else-if="competitionType === COMPETITION_TYPE.BEST_OF_N">
            <!-- Dynamic column for each run -->
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
                    :class="getBestOfNRunClass(data, stage.id)"
                  >
                    {{ getStageTime(data, stage.id) }}
                    <i
                      v-if="isAthleteBestRun(data, stage.id)"
                      class="pi pi-star-fill text-amber-500 text-xs ml-1"
                      title="Best Run"
                    ></i>
                  </span>
                </div>
              </template>
            </Column>

            <!-- Best Time Column -->
            <Column header="Best Time" field="resultTime" headerClass="text-right w-32">
              <template #body="{ data }">
                <div class="font-mono font-bold text-green-800 text-right text-base">
                  {{ data.resultTime }}
                </div>
              </template>
            </Column>

            <!-- Gap -->
            <Column header="Gap" field="displayGap" headerClass="text-right w-28">
              <template #body="{ data }">
                <div class="font-mono text-sm text-right" :class="data.displayGap === '0.00' ? 'font-bold text-green-700' : 'text-gray-600'">
                  {{ data.displayGap }}
                </div>
              </template>
            </Column>
          </template>

          <!-- ================= QUALIFYING + FINAL FORMAT COLUMNS ================= -->
          <template v-else-if="competitionType === COMPETITION_TYPE.QUALIFYING_FINAL">
            <!-- When viewing Overall mode -->
            <template v-if="selectedQfMode === 'overall'">
              <Column header="Qualifying" headerClass="text-center w-32">
                <template #body="{ data }">
                  <div class="font-mono text-sm text-center text-gray-700">
                    {{ data.qFormatted }}
                  </div>
                </template>
              </Column>
              <Column header="Final" headerClass="text-center w-32">
                <template #body="{ data }">
                  <div class="font-mono font-semibold text-center" :class="data.fRun?.status === 'FINISHED' ? 'text-blue-700' : 'text-gray-400'">
                    {{ data.fFormatted }}
                  </div>
                </template>
              </Column>
              <Column header="Result" field="resultTime" headerClass="text-right w-32">
                <template #body="{ data }">
                  <div class="font-mono font-bold text-gray-900 text-right text-base">
                    {{ data.resultTime }}
                  </div>
                  <div v-if="data.note" class="text-xs text-gray-500 text-right">
                    {{ data.note }}
                  </div>
                </template>
              </Column>
              <Column header="Gap" field="displayGap" headerClass="text-right w-28">
                <template #body="{ data }">
                  <div class="font-mono text-sm text-right" :class="data.displayGap === '0.00' ? 'font-bold text-green-700' : 'text-gray-600'">
                    {{ data.displayGap }}
                  </div>
                </template>
              </Column>
            </template>

            <!-- When viewing Final only or Qualifying only -->
            <template v-else>
              <Column :header="selectedQfMode === 'final' ? 'Final Time' : 'Qualifying Time'" field="resultTime" headerClass="text-right w-32">
                <template #body="{ data }">
                  <div class="font-mono font-bold text-gray-900 text-right text-base">
                    {{ data.resultTime }}
                  </div>
                </template>
              </Column>
              <Column header="Gap" field="displayGap" headerClass="text-right w-28">
                <template #body="{ data }">
                  <div class="font-mono text-sm text-right" :class="data.displayGap === '0.00' ? 'font-bold text-green-700' : 'text-gray-600'">
                    {{ data.displayGap }}
                  </div>
                </template>
              </Column>
            </template>
          </template>

          <!-- ================= MULTI-STAGE / ENDURO FORMAT COLUMNS ================= -->
          <template v-else>
            <!-- Column for each special stage -->
            <Column
              v-for="stage in sortedStages"
              :key="stage.id"
              :header="stage.name || `SS ${stage.number}`"
              headerClass="text-center w-28"
            >
              <template #body="{ data }">
                <div class="font-mono text-sm text-center text-gray-700">
                  {{ getStageTime(data, stage.id) }}
                </div>
              </template>
            </Column>

            <!-- Total Time Column -->
            <Column header="Total Time" field="resultTime" headerClass="text-right w-32">
              <template #body="{ data }">
                <div class="font-mono font-bold text-gray-900 text-right text-base">
                  {{ data.resultTime }}
                </div>
              </template>
            </Column>

            <!-- Gap -->
            <Column header="Gap" field="displayGap" headerClass="text-right w-28">
              <template #body="{ data }">
                <div class="font-mono text-sm text-right" :class="data.displayGap === '0.00' ? 'font-bold text-green-700' : 'text-gray-600'">
                  {{ data.displayGap }}
                </div>
              </template>
            </Column>

            <!-- Status tag -->
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
import { calculateCompetitionResults } from '@/utils/competitionResults'

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

const categoryOptions = computed(() => {
  const set = new Set()
  rawCompetitors.value.forEach((c) => {
    if (c.category && c.category.trim()) {
      set.add(c.category.trim())
    }
  })
  const options = [{ label: 'All categories (Overall)', value: 'all' }]
  Array.from(set).sort().forEach((cat) => {
    options.push({ label: cat, value: cat })
  })
  return options
})

// Calculate full computed standings based on tournament type
const calculatedResults = computed(() => {
  return calculateCompetitionResults({
    competition: competition.value,
    stages: sortedStages.value,
    competitors: rawCompetitors.value,
    options: {
      category: selectedCategory.value,
      qfMode: selectedQfMode.value,
    },
  })
})

// Search filtered results + add display properties
const filteredResults = computed(() => {
  let list = calculatedResults.value.map((item) => {
    const isCategoryFiltered = selectedCategory.value !== 'all'
    const displayPlace = isCategoryFiltered ? (item.categoryPlace ?? item.place) : item.place
    const displayGap = isCategoryFiltered ? (item.categoryGapFormatted ?? item.gapFormatted) : item.gapFormatted
    return {
      ...item,
      displayPlace,
      displayGap,
    }
  })

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
})

const totalRidersCount = computed(() => {
  return calculatedResults.value.length
})

const finishedRidersCount = computed(() => {
  return calculatedResults.value.filter((r) => r.place != null).length
})

const leaderResult = computed(() => {
  return calculatedResults.value.find((r) => r.place === 1) || null
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

const getBestOfNRunClass = (athlete, stageId) => {
  if (isAthleteBestRun(athlete, stageId)) {
    return 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300'
  }
  const run = athlete.stageRuns?.[stageId]
  if (run?.status === 'FINISHED') return 'bg-gray-100 text-gray-800'
  if (run?.status === 'DNF') return 'bg-red-50 text-red-700 font-medium'
  return 'text-gray-400'
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
.medal {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  border-radius: 9999px;
  padding: 0.15rem 0.6rem;
  font-size: 0.875rem;
}

.medal.gold {
  background-color: #fef3c7;
  color: #92400e;
  border: 1px solid #fcd34d;
}

.medal.silver {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.medal.bronze {
  background-color: #ffedd5;
  color: #9a3412;
  border: 1px solid #fdba74;
}

@media print {
  .no-print {
    display: none !important;
  }
  .print-header {
    display: block !important;
  }
  .competition-results {
    padding: 0;
  }
  :deep(.p-card) {
    box-shadow: none !important;
    border: none !important;
    padding: 0 !important;
  }
  :deep(.p-card-body),
  :deep(.p-card-content) {
    padding: 0 !important;
  }
  :deep(.p-datatable-table) {
    width: 100% !important;
    font-size: 11pt !important;
  }
}
</style>

