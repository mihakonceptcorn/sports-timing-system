<template>
  <div class="competition-preview-wrapper w-full">
    <!-- Breadcrumbs navigation -->
    <AppBreadcrumb :items="breadcrumbItems" />

    <Card class="relative">
      <template #content>
        <!-- Top action bar -->
        <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div class="flex items-center gap-2 flex-wrap">
            <Button
              @click.prevent="$router.push({ name: 'competitions' })"
              :label="locale === 'ua' ? 'До змагань' : 'Competitions'"
              icon="pi pi-arrow-left"
              severity="secondary"
              outlined
              size="small"
            />
            <Button
              @click.prevent="goToResults"
              :label="locale === 'ua' ? 'Переглянути результати' : 'View Results'"
              icon="pi pi-trophy"
              severity="success"
              size="small"
            />
          </div>

          <div class="flex items-center gap-2">
            <Button
              @click.prevent="goToEdit"
              icon="pi pi-pencil"
              :label="locale === 'ua' ? 'Редагувати' : 'Edit'"
              severity="secondary"
              text
              size="small"
            />
            <Button
              @click.prevent="confirmDialog"
              icon="pi pi-trash"
              :label="locale === 'ua' ? 'Видалити' : 'Delete'"
              severity="danger"
              text
              size="small"
            />
          </div>
        </div>

        <!-- Competition Header -->
        <div v-if="competition" class="mb-6 border-b border-surface-200 dark:border-surface-800 pb-4">
          <div class="flex items-center gap-3 flex-wrap">
            <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-0">
              {{ competition.name }}
            </h2>
            <Tag
              :value="competitionTypeLabel(competition.type, { short: true, locale })"
              severity="info"
              class="text-xs uppercase font-bold"
            />
          </div>
          <div class="text-sm text-surface-500 dark:text-surface-400 mt-2 flex items-center gap-4 flex-wrap">
            <span v-if="competition.location || competition.city || competition.country">
              <i class="pi pi-map-marker mr-1 text-red-500"></i>
              {{ [competition.location, competition.city, competition.country].filter(Boolean).join(', ') }}
            </span>
            <span v-if="competition.date">
              <i class="pi pi-calendar mr-1 text-blue-500"></i>
              {{ formatDate(competition.date) }}
            </span>
            <span>
              <i class="pi pi-flag mr-1 text-primary-500"></i>
              {{ stagesStore.stages.length }} {{ locale === 'ua' ? 'етапів' : 'stages' }}
            </span>
          </div>
        </div>

        <!-- Main Navigation Tabs: Info | Stages | Competitors -->
        <Tabs v-model:value="activeTab">
          <TabList>
            <Tab value="info">
              <i class="pi pi-info-circle mr-2"></i>
              {{ locale === 'ua' ? 'Інформація' : 'Information' }}
            </Tab>
            <Tab value="stages">
              <i class="pi pi-list mr-2"></i>
              {{ locale === 'ua' ? 'Етапи' : 'Stages' }}
              <Badge :value="stagesStore.stages.length" severity="secondary" class="ml-1 text-xs" />
            </Tab>
            <Tab value="competitors">
              <i class="pi pi-users mr-2"></i>
              {{ locale === 'ua' ? 'Учасники' : 'Competitors' }}
              <Badge :value="totalCompetitorsCount" severity="secondary" class="ml-1 text-xs" />
            </Tab>
          </TabList>

          <TabPanels>
            <!-- TAB 1: INFO -->
            <TabPanel value="info">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
                <Card class="border border-surface-200 dark:border-surface-800 shadow-none">
                  <template #title>
                    <span class="text-base font-semibold">
                      {{ locale === 'ua' ? 'Параметри змагання' : 'Competition Details' }}
                    </span>
                  </template>
                  <template #content>
                    <div class="flex flex-col gap-2.5 text-sm">
                      <div class="flex justify-between py-1 border-b border-surface-100 dark:border-surface-800">
                        <span class="text-surface-500 dark:text-surface-400">{{ locale === 'ua' ? 'Країна:' : 'Country:' }}</span>
                        <span class="font-medium text-surface-900 dark:text-surface-0">{{ competition?.country || '—' }}</span>
                      </div>
                      <div class="flex justify-between py-1 border-b border-surface-100 dark:border-surface-800">
                        <span class="text-surface-500 dark:text-surface-400">{{ locale === 'ua' ? 'Місто:' : 'City:' }}</span>
                        <span class="font-medium text-surface-900 dark:text-surface-0">{{ competition?.city || '—' }}</span>
                      </div>
                      <div class="flex justify-between py-1 border-b border-surface-100 dark:border-surface-800">
                        <span class="text-surface-500 dark:text-surface-400">{{ locale === 'ua' ? 'Локація:' : 'Location:' }}</span>
                        <span class="font-medium text-surface-900 dark:text-surface-0">{{ competition?.location || '—' }}</span>
                      </div>
                      <div class="flex justify-between py-1 border-b border-surface-100 dark:border-surface-800">
                        <span class="text-surface-500 dark:text-surface-400">{{ locale === 'ua' ? 'Дата:' : 'Date:' }}</span>
                        <span class="font-medium text-surface-900 dark:text-surface-0">{{ formatDate(competition?.date) }}</span>
                      </div>
                      <div class="flex justify-between py-1 border-b border-surface-100 dark:border-surface-800">
                        <span class="text-surface-500 dark:text-surface-400">{{ locale === 'ua' ? 'Формат:' : 'Type:' }}</span>
                        <span class="font-medium text-surface-900 dark:text-surface-0">
                          {{ competitionTypeLabel(competition?.type, { locale }) }}
                        </span>
                      </div>
                      <div
                        v-if="competition?.type === COMPETITION_TYPE.BEST_OF_N"
                        class="flex justify-between py-1 border-b border-surface-100 dark:border-surface-800"
                      >
                        <span class="text-surface-500 dark:text-surface-400">{{ locale === 'ua' ? 'Спроб (runs):' : 'Runs:' }}</span>
                        <span class="font-medium text-surface-900 dark:text-surface-0">{{ competition?.runsCount || 2 }}</span>
                      </div>
                      <div v-if="competition?.description" class="pt-2">
                        <div class="text-surface-500 dark:text-surface-400 text-xs mb-1 uppercase font-semibold">
                          {{ locale === 'ua' ? 'Опис' : 'Description' }}
                        </div>
                        <p class="text-surface-700 dark:text-surface-300 whitespace-pre-line">{{ competition?.description }}</p>
                      </div>
                    </div>
                  </template>
                </Card>

                <Card class="border border-surface-200 dark:border-surface-800 shadow-none">
                  <template #title>
                    <span class="text-base font-semibold">
                      {{ locale === 'ua' ? 'Суддівська колегія' : 'Judges & Timekeepers' }}
                    </span>
                  </template>
                  <template #content>
                    <div class="text-sm flex flex-col gap-4">
                      <!-- Start Judge -->
                      <div class="border-b border-surface-100 dark:border-surface-800 pb-3">
                        <div class="flex items-center justify-between mb-1">
                          <label class="font-semibold text-xs uppercase text-surface-500 dark:text-surface-400">
                            {{ locale === 'ua' ? '🏁 Суддя на старті' : '🏁 Start Judge' }}
                          </label>
                        </div>
                        <div v-if="competition?.startJudge" class="bg-surface-50 dark:bg-surface-800 p-2.5 rounded-lg flex items-center justify-between mt-1">
                          <div class="flex items-center gap-2 truncate">
                            <i class="pi pi-play text-green-500 text-xs"></i>
                            <span class="font-medium text-surface-900 dark:text-surface-0 truncate">{{ competition.startJudge }}</span>
                          </div>
                          <Button
                            @click.prevent="removeStartJudge"
                            icon="pi pi-times"
                            severity="danger"
                            size="small"
                            text
                            rounded
                            :title="locale === 'ua' ? 'Видалити' : 'Remove'"
                          />
                        </div>
                        <div v-else class="flex gap-2 mt-1">
                          <InputText
                            type="email"
                            :placeholder="locale === 'ua' ? 'Email судді на старті' : 'Start judge email'"
                            v-model="startJudgeEmail"
                            size="small"
                            class="flex-1"
                          />
                          <Button
                            @click.prevent="saveStartJudge"
                            :label="locale === 'ua' ? 'Призначити' : 'Assign'"
                            icon="pi pi-check"
                            severity="success"
                            size="small"
                          />
                        </div>
                      </div>

                      <!-- Finish Judge -->
                      <div>
                        <div class="flex items-center justify-between mb-1">
                          <label class="font-semibold text-xs uppercase text-surface-500 dark:text-surface-400">
                            {{ locale === 'ua' ? '⏱️ Суддя на фініші' : '⏱️ Finish Judge' }}
                          </label>
                        </div>
                        <div v-if="competition?.finishJudge || competition?.timekeeper" class="bg-surface-50 dark:bg-surface-800 p-2.5 rounded-lg flex items-center justify-between mt-1">
                          <div class="flex items-center gap-2 truncate">
                            <i class="pi pi-stopwatch text-amber-500 text-xs"></i>
                            <span class="font-medium text-surface-900 dark:text-surface-0 truncate">{{ competition.finishJudge || competition.timekeeper }}</span>
                          </div>
                          <Button
                            @click.prevent="removeFinishJudge"
                            icon="pi pi-times"
                            severity="danger"
                            size="small"
                            text
                            rounded
                            :title="locale === 'ua' ? 'Видалити' : 'Remove'"
                          />
                        </div>
                        <div v-else class="flex gap-2 mt-1">
                          <InputText
                            type="email"
                            :placeholder="locale === 'ua' ? 'Email судді на фініші' : 'Finish judge email'"
                            v-model="finishJudgeEmail"
                            size="small"
                            class="flex-1"
                          />
                          <Button
                            @click.prevent="saveFinishJudge"
                            :label="locale === 'ua' ? 'Призначити' : 'Assign'"
                            icon="pi pi-check"
                            severity="warn"
                            size="small"
                          />
                        </div>
                      </div>
                    </div>
                  </template>
                </Card>
              </div>
            </TabPanel>

            <!-- TAB 2: STAGES -->
            <TabPanel value="stages">
              <div class="my-2">
                <Message v-if="stageHint" severity="info" :closable="false" class="mb-4">
                  {{ stageHint }}
                </Message>

                <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <Button
                    v-if="canAddStage"
                    @click.prevent="openCreateStage"
                    :label="createStageLabel"
                    icon="pi pi-plus"
                    size="small"
                  />
                  <Message v-else severity="secondary" :closable="false">
                    {{ stageLimitMessage }}
                  </Message>
                </div>

                <StagesView />
              </div>
            </TabPanel>

            <!-- TAB 3: COMPETITORS -->
            <TabPanel value="competitors">
              <div class="my-2">
                <CompetitionCompetitorsTab
                  :competitionId="$route.params.id"
                  :competitors="competitorsStore.competitionCompetitors"
                  :stages="stagesStore.stages"
                  @competitor-added="loadCompetitorsData"
                  @competitor-deleted="loadCompetitorsData"
                />
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <!-- Create stage dialog -->
        <Dialog v-model:visible="visible" modal :header="createStageLabel" :style="{ width: '25rem' }">
          <template v-if="competitionType === COMPETITION_TYPE.QUALIFYING_FINAL">
            <div class="flex flex-col gap-2 mb-8">
              <label for="round" class="font-semibold">Round</label>
              <Select
                v-model="selectedRound"
                inputId="round"
                :options="missingRounds"
                optionLabel="name"
                optionValue="role"
                placeholder="Select round"
                class="w-full"
              />
            </div>
          </template>
          <template v-else>
            <div class="flex items-center gap-4 mb-4">
              <label for="stageNumber" class="font-semibold w-24">Stage number</label>
              <InputNumber v-model="stageData.number" id="stageNumber" class="flex-auto" autocomplete="off"/>
            </div>
            <div class="flex items-center gap-4 mb-8">
              <label for="stageName" class="font-semibold w-24">Name</label>
              <InputText v-model="stageData.name" id="stageName" class="flex-auto" autocomplete="off" />
            </div>
          </template>
          <div class="flex justify-end gap-2">
            <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
            <Button type="button" label="Create" @click="createStage"></Button>
          </div>
        </Dialog>

        <Toast position="bottom-right"/>
        <ConfirmDialog />
      </template>
    </Card>
  </div>
</template>

<script setup>
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted, reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/js/firebase'
import { useCompetitionsStore } from '@/stores/competitions.js'
import { useStagesStore } from '@/stores/stages.js'
import { useCompetitorsStore } from '@/stores/competitors.js'
import StagesView from '@/views/competitions/StagesView.vue'
import CompetitionCompetitorsTab from '@/components/competitions/CompetitionCompetitorsTab.vue'
import AppBreadcrumb from '@/components/navigation/AppBreadcrumb.vue'
import {
  COMPETITION_TYPE,
  competitionTypeLabel,
  getCompetitionType,
  getStageLimitMessage,
  getCreateStageLabel,
  missingQualifyingFinalStages,
  nextBestOfNStage,
  nextFreeStageNumber,
} from '@/constants/competitionTypes'

const route = useRoute()
const router = useRouter()
const { locale } = useI18n()
const competitionsStore = useCompetitionsStore()
const stagesStore = useStagesStore()
const competitorsStore = useCompetitorsStore()
const confirm = useConfirm()
const toast = useToast()

const competition = ref(null)
const startJudgeEmail = ref('')
const finishJudgeEmail = ref('')
const visible = ref(false)
const selectedRound = ref(null)
const activeTab = ref('info')
let unsubscribeCompetitors = null

const stageData = reactive({
  number: 1,
  name: '',
})

const breadcrumbItems = computed(() => {
  return [
    {
      label: competition.value?.name || (locale.value === 'ua' ? 'Змагання' : 'Competition'),
    },
  ]
})

const competitionType = computed(() => competition.value?.type || COMPETITION_TYPE.MULTI_STAGE)
const stageHint = computed(() => getCompetitionType(competition.value?.type, locale.value)?.stageHint || '')
const missingRounds = computed(() => missingQualifyingFinalStages(stagesStore.stages, locale.value))

const formatDate = (dateVal) => {
  if (!dateVal) return '—'
  const d = new Date(dateVal)
  if (isNaN(d.getTime())) return String(dateVal)
  return d.toLocaleDateString(locale.value === 'ua' ? 'uk-UA' : 'en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const totalCompetitorsCount = computed(() => {
  const map = new Set()
  competitorsStore.competitionCompetitors.forEach((c) => {
    const key = c.competitorNumber != null
      ? `num_${c.competitorNumber}`
      : `name_${(c.secondName || '').trim().toLowerCase()}_${(c.name || '').trim().toLowerCase()}`
    map.add(key)
  })
  return map.size
})

const canAddStage = computed(() => {
  if (competitionType.value === COMPETITION_TYPE.SINGLE_RUN) {
    return stagesStore.stages.length === 0
  }
  if (competitionType.value === COMPETITION_TYPE.QUALIFYING_FINAL) {
    return missingRounds.value.length > 0
  }
  return true
})

const createStageLabel = computed(() => getCreateStageLabel(competitionType.value, locale.value))
const stageLimitMessage = computed(() => getStageLimitMessage(competitionType.value, locale.value))

const goToResults = () => {
  router.push({ name: 'competition-results', params: { id: route.params.id } })
}

const goToEdit = () => {
  router.push({ name: 'competition-edit', params: { id: route.params.id } })
}

const confirmDialog = () => {
  confirm.require({
    message: `Do you want to delete this competition?`,
    header: 'Danger Zone',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger',
    },
    accept: async () => {
      await competitionsStore.deleteCompetition(route.params.id)
      router.push({ name: 'competitions' })
      toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 })
    },
    reject: () => {
      toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 })
    },
  })
}

const loadCompetitorsData = () => {
  if (unsubscribeCompetitors) {
    unsubscribeCompetitors()
    unsubscribeCompetitors = null
  }
  const stageIds = stagesStore.stages.map((s) => s.id)
  unsubscribeCompetitors = competitorsStore.subscribeToCompetitionCompetitors(stageIds)
}

const initViewData = async () => {
  competition.value = null
  competitorsStore.clearCompetitors()
  stagesStore.clearStages()

  competition.value = await competitionsStore.getCompetitionById(route.params.id)
  await stagesStore.getStages(route.params.id)
  loadCompetitorsData()
}

onMounted(() => {
  initViewData()
})

watch(
  () => route.params.id,
  (newId, oldId) => {
    if (newId && newId !== oldId) {
      initViewData()
    }
  }
)

watch(
  () => stagesStore.stages,
  (newStages) => {
    if (newStages && newStages.length > 0) {
      loadCompetitorsData()
    }
  },
  { deep: true }
)

onUnmounted(() => {
  if (unsubscribeCompetitors) {
    unsubscribeCompetitors()
    unsubscribeCompetitors = null
  }
  competitorsStore.clearCompetitors()
  stagesStore.clearStages()
})

const openCreateStage = async () => {
  const isEn = locale.value === 'en'
  if (competitionType.value === COMPETITION_TYPE.SINGLE_RUN) {
    await stagesStore.createStage(route.params.id, 1, isEn ? 'Run' : 'Заїзд', 'run')
    loadCompetitorsData()
    return
  }

  if (competitionType.value === COMPETITION_TYPE.BEST_OF_N) {
    const stage = nextBestOfNStage(stagesStore.stages, locale.value)
    await stagesStore.createStage(route.params.id, stage.number, stage.name, stage.role)
    const runsCount = Math.max(2, stagesStore.stages.length + 1)
    await competitionsStore.updateRunsCount(route.params.id, runsCount)
    if (competition.value) competition.value.runsCount = runsCount
    loadCompetitorsData()
    return
  }

  if (competitionType.value === COMPETITION_TYPE.QUALIFYING_FINAL) {
    if (missingRounds.value.length === 1) {
      const stage = missingRounds.value[0]
      await stagesStore.createStage(route.params.id, stage.number, stage.name, stage.role)
      loadCompetitorsData()
      return
    }
    selectedRound.value = missingRounds.value[0]?.role || null
    visible.value = true
    return
  }

  const numbers = stagesStore.stages.map((stage) => Number(stage.number) || 0)
  stageData.number = nextFreeStageNumber(stagesStore.stages, (numbers.length ? Math.max(...numbers) : 0) + 1)
  stageData.name = ''
  visible.value = true
}

const createStage = async () => {
  if (competitionType.value === COMPETITION_TYPE.QUALIFYING_FINAL) {
    const stage = missingRounds.value.find((round) => round.role === selectedRound.value)
    if (!stage) return
    visible.value = false
    await stagesStore.createStage(route.params.id, stage.number, stage.name, stage.role)
    loadCompetitorsData()
    return
  }

  if (!stageData.name) return
  visible.value = false
  await stagesStore.createStage(route.params.id, stageData.number, stageData.name, 'special')
  loadCompetitorsData()
}

const saveStartJudge = async () => {
  const email = startJudgeEmail.value?.trim()
  if (!email) return
  if (typeof competitionsStore.setStartJudge === 'function') {
    await competitionsStore.setStartJudge(route.params.id, email)
  } else {
    await updateDoc(doc(db, 'competitions', route.params.id), { startJudge: email })
  }
  competition.value = await competitionsStore.getCompetitionById(route.params.id)
  startJudgeEmail.value = ''
  toast.add({ severity: 'success', summary: 'Успішно', detail: 'Суддю на старті призначено', life: 3000 })
}

const removeStartJudge = async () => {
  if (typeof competitionsStore.removeStartJudge === 'function') {
    await competitionsStore.removeStartJudge(route.params.id)
  } else {
    await updateDoc(doc(db, 'competitions', route.params.id), { startJudge: null })
  }
  competition.value = await competitionsStore.getCompetitionById(route.params.id)
  toast.add({ severity: 'info', summary: 'Видалено', detail: 'Суддю на старті видалено', life: 3000 })
}

const saveFinishJudge = async () => {
  const email = finishJudgeEmail.value?.trim()
  if (!email) return
  if (typeof competitionsStore.setFinishJudge === 'function') {
    await competitionsStore.setFinishJudge(route.params.id, email)
  } else {
    await updateDoc(doc(db, 'competitions', route.params.id), { finishJudge: email, timekeeper: email })
  }
  competition.value = await competitionsStore.getCompetitionById(route.params.id)
  finishJudgeEmail.value = ''
  toast.add({ severity: 'success', summary: 'Успішно', detail: 'Суддю на фініші призначено', life: 3000 })
}

const removeFinishJudge = async () => {
  if (typeof competitionsStore.removeFinishJudge === 'function') {
    await competitionsStore.removeFinishJudge(route.params.id)
  } else {
    await updateDoc(doc(db, 'competitions', route.params.id), { finishJudge: null, timekeeper: null })
  }
  competition.value = await competitionsStore.getCompetitionById(route.params.id)
  toast.add({ severity: 'info', summary: 'Видалено', detail: 'Суддю на фініші видалено', life: 3000 })
}
</script>
