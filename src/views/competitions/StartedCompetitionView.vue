<template>
  <div
    :class="{'full': isFullscreen}"
    ref="fullscreen"
    class="started-competition w-full min-h-[85vh] flex flex-col"
  >
    <AppBreadcrumb v-if="!isFullscreen" :items="breadcrumbItems" />

    <!-- Top bar -->
    <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
      <div class="flex items-center gap-2">
        <Button
          :label="locale === 'ua' ? 'Панель суддівства' : 'Timekeeping'"
          @click.prevent="$router.push({ name: 'timekeeping' })"
          severity="secondary"
          size="small"
          outlined
          icon="pi pi-arrow-left"
        />
        <span class="font-bold text-surface-900 dark:text-surface-0">
          {{ stage?.name || 'Stage' }} — {{ locale === 'ua' ? 'Стартовий стіл' : 'Start Gate' }}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <Button
          :label="isFullscreen ? (locale === 'ua' ? 'Згорнути' : 'Exit Fullscreen') : (locale === 'ua' ? 'На весь екран' : 'Fullscreen')"
          :icon="isFullscreen ? 'pi pi-window-minimize' : 'pi pi-window-maximize'"
          @click.prevent="toggleFullScreen"
          size="small"
          severity="secondary"
          text
        />
      </div>
    </div>

    <!-- MAIN START GATE AREA -->
    <div class="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full my-4">
      <!-- Active rider ready to start -->
      <Card v-if="currentCompetitor" class="w-full border-2 border-primary-500 shadow-lg text-center">
        <template #content>
          <div class="text-xs uppercase font-bold tracking-wider text-surface-500 dark:text-surface-400 mb-2">
            {{ locale === 'ua' ? 'Наступний на старті' : 'Next at Start Gate' }}
          </div>

          <!-- Big competitor number -->
          <div class="text-7xl sm:text-8xl font-black font-mono text-primary-600 dark:text-primary-400 my-2">
            #{{ currentCompetitor.competitorNumber }}
          </div>

          <!-- Competitor full name -->
          <div class="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-surface-0 mb-1">
            {{ currentCompetitor.secondName }} {{ currentCompetitor.name }}
          </div>

          <div class="flex items-center justify-center gap-2 text-sm text-surface-500 dark:text-surface-400 mb-6">
            <Tag :value="currentCompetitor.category || '—'" severity="secondary" class="uppercase text-xs" />
            <span v-if="currentCompetitor.team">• {{ currentCompetitor.team }}</span>
          </div>

          <!-- COUNTDOWN DISPLAY OR BIG START BUTTON -->
          <div class="my-4">
            <div
              v-if="isCountingDown"
              class="w-full py-8 rounded-2xl bg-primary text-primary-contrast text-6xl sm:text-7xl font-black tracking-widest animate-pulse flex items-center justify-center shadow-lg"
            >
              {{ countdownText }}
            </div>

            <Button
              v-else
              @click="startCountdown(currentCompetitor)"
              :label="locale === 'ua' ? 'СТАРТ' : 'START'"
              icon="pi pi-play"
              severity="success"
              class="w-full py-6 text-3xl sm:text-4xl font-black tracking-wider shadow-lg hover:scale-[1.01] transition-transform"
            />
          </div>

          <!-- Actions if competitor has issues: Move to End OR DNS -->
          <div class="flex items-center justify-between gap-3 pt-4 border-t border-surface-200 dark:border-surface-800 flex-wrap">
            <Button
              @click="moveToEnd(currentCompetitor)"
              :label="locale === 'ua' ? 'В кінець черги' : 'Send to back of queue'"
              icon="pi pi-replay"
              severity="secondary"
              outlined
              size="small"
              :disabled="isCountingDown || waitingCompetitors.length <= 1"
            />

            <Button
              @click="confirmDns(currentCompetitor)"
              :label="locale === 'ua' ? 'Не стартував (DNS)' : 'Did not start (DNS)'"
              icon="pi pi-times"
              severity="danger"
              text
              size="small"
              :disabled="isCountingDown"
            />
          </div>
        </template>
      </Card>

      <!-- All competitors started state -->
      <Card v-else class="w-full text-center py-10 border border-surface-200 dark:border-surface-800">
        <template #content>
          <div class="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-3xl mb-3"
            :class="isFinalStage ? 'bg-amber-500/10 text-amber-500' : 'bg-green-500/10 text-green-500'"
          >
            <i :class="isFinalStage ? 'pi pi-trophy' : 'pi pi-check'"></i>
          </div>

          <h3 class="text-2xl font-bold text-surface-900 dark:text-surface-0 mb-1">
            {{ isFinalStage
              ? (locale === 'ua' ? '🏆 Фінальний етап завершено!' : '🏆 Final Stage Completed!')
              : (locale === 'ua' ? `🏁 Старт етапу «${stage?.name}» завершено!` : `🏁 Start of "${stage?.name}" finished!`)
            }}
          </h3>

          <p class="text-sm text-surface-500 dark:text-surface-400 mb-6 max-w-md mx-auto">
            <template v-if="isFinalStage">
              {{ locale === 'ua'
                ? 'Усі учасники останнього етапу стартували. Змагання добігає кінця!'
                : 'All competitors of the final stage have started. Tournament is concluding!' }}
            </template>
            <template v-else-if="nextStage">
              {{ locale === 'ua'
                ? `Всі райдери стартували. Ви можете перейти до наступного етапу: «${nextStage.name}».`
                : `All riders have started. You can proceed to next stage: "${nextStage.name}".` }}
            </template>
            <template v-else>
              {{ locale === 'ua'
                ? 'На цьому етапі немає очікуючих райдерів. Результати фіксуються на фініші.'
                : 'No waiting riders remaining for this stage.' }}
            </template>
          </p>

          <div class="flex items-center justify-center gap-3 flex-wrap">
            <!-- Next stage button -->
            <Button
              v-if="nextStage"
              @click.prevent="goToNextStage"
              :label="locale === 'ua' ? `Старт етапу: ${nextStage.name} →` : `Start next: ${nextStage.name} →`"
              icon="pi pi-arrow-right"
              iconPos="right"
              severity="success"
            />

            <!-- View results button (especially if final stage) -->
            <Button
              @click.prevent="goToResults"
              :label="locale === 'ua' ? 'Переглянути результати' : 'View Results'"
              icon="pi pi-trophy"
              :severity="isFinalStage ? 'warn' : 'secondary'"
              :outlined="!isFinalStage"
            />

            <Button
              @click.prevent="$router.push({ name: 'timekeeping' })"
              :label="locale === 'ua' ? 'Панель суддівства' : 'Timekeeping'"
              icon="pi pi-arrow-left"
              severity="secondary"
              text
            />
          </div>
        </template>
      </Card>

      <!-- UPCOMING RIDERS PREVIEW IN QUEUE -->
      <div v-if="upcomingCompetitors.length" class="w-full mt-6 bg-surface-50 dark:bg-surface-800/40 p-4 rounded-xl border border-surface-200 dark:border-surface-800">
        <div class="text-xs uppercase font-semibold text-surface-500 dark:text-surface-400 mb-2.5">
          {{ locale === 'ua' ? 'Далі за чергою:' : 'Up next in queue:' }}
        </div>
        <div class="flex items-center gap-2 overflow-x-auto pb-1">
          <div
            v-for="(rider, idx) in upcomingCompetitors"
            :key="rider.id"
            class="flex items-center gap-2 bg-surface-0 dark:bg-surface-800 px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-700 text-sm whitespace-nowrap"
          >
            <span class="text-xs text-surface-400 font-mono">#{{ idx + 2 }}</span>
            <span class="font-bold text-primary-600 dark:text-primary-400 font-mono">#{{ rider.competitorNumber }}</span>
            <span class="font-medium text-surface-800 dark:text-surface-200">{{ rider.secondName }} {{ rider.name }}</span>
          </div>
        </div>
      </div>

      <!-- RECENTLY STARTED (ON TRACK) -->
      <div v-if="startedCompetitors.length" class="w-full mt-6">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs uppercase font-semibold text-surface-500 dark:text-surface-400">
            {{ locale === 'ua' ? 'На трасі (щойно стартували):' : 'On track (recently started):' }}
          </span>
          <Badge :value="startedCompetitors.length" severity="info" class="text-xs" />
        </div>

        <div class="flex flex-col gap-2">
          <div
            v-for="rider in recentStartedList"
            :key="rider.id"
            class="flex items-center justify-between bg-surface-50 dark:bg-surface-800/60 p-2.5 rounded-lg border border-surface-200 dark:border-surface-700 text-sm"
          >
            <div class="flex items-center gap-3">
              <span class="font-mono font-bold text-green-600 dark:text-green-400">#{{ rider.competitorNumber }}</span>
              <span class="font-medium text-surface-900 dark:text-surface-0">{{ rider.secondName }} {{ rider.name }}</span>
              <span class="text-xs text-surface-400">{{ formatStartTime(rider.startTime) }}</span>
            </div>
            <Button
              @click="undoStart(rider)"
              icon="pi pi-undo"
              :label="locale === 'ua' ? 'Скасувати фальстарт' : 'Undo'"
              severity="secondary"
              text
              size="small"
              class="text-xs"
            />
          </div>
        </div>
      </div>
    </div>

    <ConfirmDialog group="start-confirm" />
    <Toast position="bottom-right" />
  </div>
</template>

<script setup>
import { useCompetitorsStore } from '@/stores/competitors.js'
import { useTimersStore } from '@/stores/timers.js'
import { useCompetitionsStore } from '@/stores/competitions.js'
import { useStagesStore } from '@/stores/stages.js'
import { onMounted, ref, computed, useTemplateRef, watch } from 'vue'
import { useFullscreen } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import AppBreadcrumb from '@/components/navigation/AppBreadcrumb.vue'

const competitorsStore = useCompetitorsStore()
const timerStore = useTimersStore()
const competitionsStore = useCompetitionsStore()
const stagesStore = useStagesStore()
const route = useRoute()
const router = useRouter()
const { locale } = useI18n()
const toast = useToast()
const confirm = useConfirm()

const competition = ref(null)
const stage = ref(null)
const isCountingDown = ref(false)
const countdownText = ref('3')
const queueOverrides = ref([]) // IDs moved to end of queue

const el = useTemplateRef('fullscreen')
const { isFullscreen, toggle } = useFullscreen(el)

const toggleFullScreen = () => {
  toggle()
}

const breadcrumbItems = computed(() => [
  {
    label: competition.value?.name || (locale.value === 'ua' ? 'Змагання' : 'Competition'),
    to: { name: 'competition-preview', params: { id: route.params.id } },
  },
  {
    label: stage.value?.name || (locale.value === 'ua' ? 'Етап' : 'Stage'),
    to: { name: 'stage-preview', params: { id: route.params.id, stageId: route.params.stageId } },
  },
  {
    label: locale.value === 'ua' ? 'Стартовий стіл' : 'Start Gate',
  },
])

const sortedStages = computed(() => {
  return [...stagesStore.stages].sort((a, b) => (Number(a.number) || 0) - (Number(b.number) || 0))
})

const currentStageIndex = computed(() => {
  return sortedStages.value.findIndex((s) => s.id === route.params.stageId)
})

const nextStage = computed(() => {
  if (currentStageIndex.value >= 0 && currentStageIndex.value < sortedStages.value.length - 1) {
    return sortedStages.value[currentStageIndex.value + 1]
  }
  return null
})

const isFinalStage = computed(() => {
  if (sortedStages.value.length === 0) return true
  return currentStageIndex.value === sortedStages.value.length - 1
})

const goToNextStage = () => {
  if (!nextStage.value) return
  router.push({
    name: 'started',
    params: { id: route.params.id, stageId: nextStage.value.id },
  })
}

const goToResults = () => {
  router.push({ name: 'competition-results', params: { id: route.params.id } })
}

// Competitors waiting for start (not started, not DNS)
const waitingCompetitors = computed(() => {
  const notStarted = competitorsStore.competitors.filter(
    (c) => !c.started && c.status !== 'DNS' && !c.finishTime
  )

  // Sort primarily by competitorNumber (or original list order)
  const sorted = [...notStarted].sort((a, b) => {
    const numA = Number(a.competitorNumber) || 99999
    const numB = Number(b.competitorNumber) || 99999
    return numA - numB
  })

  // Apply overrides for those moved to the end
  const normal = []
  const movedToEnd = []

  sorted.forEach((c) => {
    if (queueOverrides.value.includes(c.id)) {
      movedToEnd.push(c)
    } else {
      normal.push(c)
    }
  })

  return [...normal, ...movedToEnd]
})

// Current rider at the gate
const currentCompetitor = computed(() => {
  return waitingCompetitors.value.length > 0 ? waitingCompetitors.value[0] : null
})

// Next riders in queue
const upcomingCompetitors = computed(() => {
  return waitingCompetitors.value.slice(1, 6)
})

// Started competitors
const startedCompetitors = computed(() => {
  return competitorsStore.competitors.filter((c) => c.started && !c.finishTime)
})

const recentStartedList = computed(() => {
  return [...startedCompetitors.value].sort((a, b) => (b.startTime || 0) - (a.startTime || 0)).slice(0, 5)
})

const formatStartTime = (ts) => {
  if (!ts) return ''
  const d = new Date(ts)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

// Move current rider to the end of queue
const moveToEnd = (competitor) => {
  if (!competitor?.id) return
  if (!queueOverrides.value.includes(competitor.id)) {
    queueOverrides.value.push(competitor.id)
  } else {
    // move it to the very last position in the array
    queueOverrides.value = queueOverrides.value.filter((id) => id !== competitor.id)
    queueOverrides.value.push(competitor.id)
  }
  toast.add({
    severity: 'info',
    summary: locale.value === 'ua' ? 'Переміщено' : 'Moved',
    detail: locale.value === 'ua'
      ? `Учасника #${competitor.competitorNumber} переміщено в кінець черги`
      : `Competitor #${competitor.competitorNumber} moved to the end of queue`,
    life: 2500,
  })
}

// Mark rider as DNS
const confirmDns = (competitor) => {
  confirm.require({
    group: 'start-confirm',
    message: locale.value === 'ua'
      ? `Позначити учасника #${competitor.competitorNumber} (${competitor.secondName} ${competitor.name}) як DNS (Не стартував)?`
      : `Mark competitor #${competitor.competitorNumber} (${competitor.secondName} ${competitor.name}) as DNS?`,
    header: locale.value === 'ua' ? 'Підтвердження DNS' : 'Confirm DNS',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: locale.value === 'ua' ? 'Скасувати' : 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'DNS',
      severity: 'danger',
    },
    accept: async () => {
      await competitorsStore.markDns(competitor.id)
      queueOverrides.value = queueOverrides.value.filter((id) => id !== competitor.id)
      toast.add({
        severity: 'warn',
        summary: 'DNS',
        detail: locale.value === 'ua' ? 'Учасника позначено як DNS' : 'Competitor marked as DNS',
        life: 3000,
      })
    },
  })
}

// Sound beeper
const playBeep = (freq, durationMs) => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const osc = audioContext.createOscillator()
    const gain = audioContext.createGain()
    osc.connect(gain)
    gain.connect(audioContext.destination)
    osc.frequency.value = freq
    osc.start()
    setTimeout(() => {
      osc.stop()
      audioContext.close()
    }, durationMs)
  } catch (e) {
    console.error('Audio beep error:', e)
  }
}

// Start countdown 3-2-1-GO!
const startCountdown = (competitor) => {
  if (isCountingDown.value || !competitor) return
  isCountingDown.value = true

  let step = 0
  countdownText.value = '3'
  playBeep(1000, 200)

  const timer = setInterval(async () => {
    step++
    if (step === 1) {
      countdownText.value = '2'
      playBeep(1000, 200)
    } else if (step === 2) {
      countdownText.value = '1'
      playBeep(1000, 200)
    } else if (step === 3) {
      countdownText.value = 'GO!'
      playBeep(2000, 700)

      const timestamp = Date.now()
      // Create active timer in Firestore
      await timerStore.createTimer(
        route.params.id,
        route.params.stageId,
        competitor.id,
        competitor.competitorNumber
      )
      // Mark competitor as started
      await competitorsStore.updateStartTime(competitor.id, timestamp)
      // Clean from queue overrides
      queueOverrides.value = queueOverrides.value.filter((id) => id !== competitor.id)

      setTimeout(() => {
        isCountingDown.value = false
      }, 700)

      clearInterval(timer)
    }
  }, 1000)
}

// Undo accidental start
const undoStart = async (rider) => {
  await competitorsStore.resetStart(rider.id)
  // Delete timer from timerStore if exists
  const activeTimer = timerStore.timers.find((t) => t.competitorId === rider.id)
  if (activeTimer) {
    await timerStore.stopTimer(activeTimer.id)
  }
  toast.add({
    severity: 'info',
    summary: locale.value === 'ua' ? 'Скасовано' : 'Undone',
    detail: locale.value === 'ua'
      ? `Старт учасника #${rider.competitorNumber} скасовано`
      : `Start of #${rider.competitorNumber} cancelled`,
    life: 3000,
  })
}

const loadStageData = async () => {
  competition.value = await competitionsStore.getCompetitionById(route.params.id)
  stage.value = await stagesStore.getStageById(route.params.stageId)
  await stagesStore.getStages(route.params.id)
  await competitorsStore.getCompetitors(route.params.stageId)
  await timerStore.getTimers(route.params.id)
  queueOverrides.value = []
}

onMounted(() => {
  loadStageData()
})

watch(
  () => route.params.stageId,
  (newStageId, oldStageId) => {
    if (newStageId && newStageId !== oldStageId) {
      loadStageData()
    }
  }
)
</script>

<style scoped>
.full {
  background-color: var(--p-surface-0);
  padding: 1rem;
}
</style>
