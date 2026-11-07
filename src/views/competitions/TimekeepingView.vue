<template>
  <div class="timekeeping w-full">
    <div class="flex items-center justify-between mb-6 flex-wrap gap-2">
      <div>
        <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-0">
          {{ locale === 'ua' ? 'Панель суддівства (Хронометраж)' : 'Timekeeping Panel' }}
        </h2>
        <p class="text-sm text-surface-500 dark:text-surface-400 mt-1">
          {{ locale === 'ua'
            ? 'Змагання, до яких вас призначено суддею на старті або фініші.'
            : 'Competitions where you are assigned as a start or finish judge.' }}
        </p>
      </div>
    </div>

    <div v-if="competitionsStore.timeKeepingCompetitions.length" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card
        v-for="comp in competitionsStore.timeKeepingCompetitions"
        :key="comp.id"
        class="border border-surface-200 dark:border-surface-800"
      >
        <template #title>
          <div class="flex items-center justify-between gap-2">
            <span class="text-lg font-bold text-surface-900 dark:text-surface-0">{{ comp.name }}</span>
            <div class="flex items-center gap-1.5 flex-wrap">
              <Tag
                v-if="isStartJudge(comp)"
                :value="locale === 'ua' ? '🏁 СТАРТ' : '🏁 START'"
                severity="success"
                class="text-xs font-bold"
              />
              <Tag
                v-if="isFinishJudge(comp)"
                :value="locale === 'ua' ? '⏱️ ФІНІШ' : '⏱️ FINISH'"
                severity="warn"
                class="text-xs font-bold"
              />
            </div>
          </div>
        </template>

        <template #content>
          <div class="text-sm text-surface-600 dark:text-surface-400 mb-4 flex flex-col gap-1">
            <div v-if="comp.city || comp.location">
              <i class="pi pi-map-marker mr-1.5 text-xs text-red-500"></i>
              {{ [comp.location, comp.city].filter(Boolean).join(', ') }}
            </div>
            <div v-if="comp.date">
              <i class="pi pi-calendar mr-1.5 text-xs text-blue-500"></i>
              {{ formatDate(comp.date) }}
            </div>
          </div>

          <div class="flex items-center gap-2 flex-wrap pt-2 border-t border-surface-100 dark:border-surface-800">
            <!-- Button for Start Judge -->
            <Button
              v-if="isStartJudge(comp)"
              @click="handleStartClick(comp)"
              :loading="loadingCompId === comp.id"
              :label="locale === 'ua' ? 'Стартовий стіл' : 'Start Gate'"
              icon="pi pi-play"
              severity="success"
              size="small"
            />

            <!-- Button for Finish Judge -->
            <Button
              v-if="isFinishJudge(comp)"
              @click="goToFinish(comp)"
              :label="locale === 'ua' ? 'Фінішний створ' : 'Finish Timer'"
              icon="pi pi-stopwatch"
              severity="warn"
              size="small"
            />

            <!-- Overview button -->
            <Button
              @click="goToPreview(comp)"
              :label="locale === 'ua' ? 'Деталі турніру' : 'Details'"
              icon="pi pi-eye"
              severity="secondary"
              size="small"
              text
            />
          </div>
        </template>
      </Card>
    </div>

    <!-- Empty state -->
    <Card v-else class="text-center py-10 border border-surface-200 dark:border-surface-800">
      <template #content>
        <i class="pi pi-clock text-4xl text-surface-400 mb-3 block"></i>
        <h3 class="text-lg font-bold text-surface-900 dark:text-surface-0 mb-1">
          {{ locale === 'ua' ? 'Немає призначених змагань' : 'No assigned competitions' }}
        </h3>
        <p class="text-sm text-surface-500 dark:text-surface-400 max-w-md mx-auto">
          {{ locale === 'ua'
            ? 'Адміністратор турніру ще не призначив ваш email суддею на старті чи фініші.'
            : 'You have not been assigned as a start or finish judge for any competitions yet.' }}
        </p>
      </template>
    </Card>

    <!-- Dialog to select stage when competition has multiple stages -->
    <Dialog
      v-model:visible="stageSelectVisible"
      modal
      :header="locale === 'ua' ? 'Оберіть етап для старту' : 'Select Stage for Start'"
      :style="{ width: '25rem' }"
    >
      <p class="text-sm text-surface-600 dark:text-surface-400 mb-4">
        {{ locale === 'ua' ? 'Оберіть спецділянку / заїзд для відкриття стартового столу:' : 'Select a stage to open start gate:' }}
      </p>

      <div class="flex flex-col gap-2">
        <Button
          v-for="stg in availableStages"
          :key="stg.id"
          @click="openStartGate(activeCompetitionId, stg.id)"
          :label="stg.name || ('Stage ' + stg.number)"
          icon="pi pi-play"
          severity="success"
          outlined
          class="justify-start text-left"
        />
      </div>

      <template #footer>
        <Button
          :label="locale === 'ua' ? 'Скасувати' : 'Cancel'"
          severity="secondary"
          @click="stageSelectVisible = false"
        />
      </template>
    </Dialog>

    <Toast position="bottom-right" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'
import { useCompetitionsStore } from '@/stores/competitions.js'
import { useStagesStore } from '@/stores/stages.js'
import { useAuthStore } from '@/stores/auth.js'

const router = useRouter()
const { locale } = useI18n()
const toast = useToast()
const competitionsStore = useCompetitionsStore()
const stagesStore = useStagesStore()
const authStore = useAuthStore()

const loadingCompId = ref(null)
const stageSelectVisible = ref(false)
const availableStages = ref([])
const activeCompetitionId = ref(null)

const userEmail = () => authStore.user?.email

const isStartJudge = (comp) => {
  return comp.startJudge === userEmail() || (!comp.startJudge && !comp.finishJudge)
}

const isFinishJudge = (comp) => {
  return comp.finishJudge === userEmail() || comp.timekeeper === userEmail() || (!comp.startJudge && !comp.finishJudge)
}

const formatDate = (val) => {
  if (!val) return ''
  const d = new Date(val)
  return isNaN(d.getTime()) ? String(val) : d.toLocaleDateString()
}

const handleStartClick = async (comp) => {
  loadingCompId.value = comp.id
  try {
    await stagesStore.getStages(comp.id)
    const stages = [...stagesStore.stages].sort((a, b) => (Number(a.number) || 0) - (Number(b.number) || 0))

    if (stages.length === 0) {
      toast.add({
        severity: 'warn',
        summary: locale.value === 'ua' ? 'Увага' : 'Warning',
        detail: locale.value === 'ua'
          ? 'У цьому змаганні ще немає створених етапів'
          : 'No stages have been created for this competition yet',
        life: 3500,
      })
      return
    }

    if (stages.length === 1) {
      // Exactly 1 stage: open start gate immediately!
      openStartGate(comp.id, stages[0].id)
      return
    }

    // Multiple stages: show dialog
    activeCompetitionId.value = comp.id
    availableStages.value = stages
    stageSelectVisible.value = true
  } catch (error) {
    console.error('Failed to load stages for start gate:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load stages',
      life: 3000,
    })
  } finally {
    loadingCompId.value = null
  }
}

const openStartGate = (competitionId, stageId) => {
  stageSelectVisible.value = false
  router.push({
    name: 'started',
    params: { id: competitionId, stageId },
  })
}

const goToFinish = (comp) => {
  router.push({ name: 'timekeeping-competition', params: { id: comp.id } })
}

const goToPreview = (comp) => {
  router.push({ name: 'competition-preview', params: { id: comp.id } })
}

onMounted(() => {
  competitionsStore.getTimekeepingCompetitions()
})
</script>
