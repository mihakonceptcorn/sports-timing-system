<template>
  <div
    :class="{'full': isFullscreen}"
    class="timekeeping-competition w-full min-h-[85vh] flex flex-col"
    ref="fullscreen"
  >
    <AppBreadcrumb v-if="!isFullscreen" :items="breadcrumbItems" />

    <!-- Top Navigation Bar -->
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
          {{ competition?.name || 'Competition' }} — {{ locale === 'ua' ? 'Фінішний створ' : 'Finish Gate' }}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <!-- Stage switcher dropdown if multiple stages exist -->
        <Select
          v-if="sortedStages.length > 1"
          v-model="selectedStageId"
          :options="sortedStages"
          optionLabel="name"
          optionValue="id"
          size="small"
          class="w-40 sm:w-52"
        />

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

    <!-- Live Status Summary Bar -->
    <div class="bg-surface-50 dark:bg-surface-800/60 border border-surface-200 dark:border-surface-800 rounded-xl p-3 mb-6 flex items-center justify-between flex-wrap gap-3">
      <div class="flex items-center gap-4 flex-wrap text-sm">
        <div class="flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
          <span class="font-semibold text-surface-900 dark:text-surface-0">
            {{ locale === 'ua' ? 'На трасі:' : 'On track:' }}
          </span>
          <Badge :value="activeTimers.length" severity="danger" class="font-bold" />
        </div>

        <div class="flex items-center gap-1.5 text-surface-600 dark:text-surface-400">
          <span>{{ locale === 'ua' ? 'Фінішували:' : 'Finished:' }}</span>
          <span class="font-bold text-surface-900 dark:text-surface-0">{{ finishedCompetitorsCount }}</span>
          <span>{{ locale === 'ua' ? 'з' : 'of' }}</span>
          <span class="font-bold text-surface-900 dark:text-surface-0">{{ totalStageCompetitorsCount }}</span>
        </div>
      </div>

      <div class="text-xs">
        <Tag
          v-if="isStartClosed && activeTimers.length > 0"
          :value="locale === 'ua' ? '🏁 Старт закрито. Очікуємо останні фініші' : '🏁 Start closed. Waiting for last finishes'"
          severity="warn"
        />
        <Tag
          v-else-if="activeTimers.length > 0"
          :value="locale === 'ua' ? '🟢 Старт триває' : '🟢 Start in progress'"
          severity="success"
        />
      </div>
    </div>

    <!-- MAIN ACTIVE RIDERS ON TRACK TO STOP -->
    <div v-if="activeTimers.length > 0" class="flex-1 flex flex-col justify-center max-w-3xl mx-auto w-full">
      <div class="text-center mb-4">
        <span class="text-xs uppercase font-bold tracking-wider text-surface-500 dark:text-surface-400">
          {{ locale === 'ua' ? 'Натисніть на номер для зупинки часу на фініші' : 'Click rider card to record finish time' }}
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          v-for="timer in activeTimers"
          :key="timer.id"
          @click="stopTimer(timer)"
          class="bg-surface-0 dark:bg-surface-800 border-2 border-red-500/70 hover:border-red-500 p-6 rounded-2xl shadow-lg cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-center justify-between min-h-[220px] select-none text-center"
        >
          <div class="text-xs uppercase font-bold text-surface-500 dark:text-surface-400">
            {{ getCompetitorName(timer.competitorId) }}
          </div>

          <div class="text-6xl sm:text-7xl font-black font-mono text-red-600 dark:text-red-400 my-2">
            #{{ timer.number }}
          </div>

          <div class="w-full">
            <Button
              :label="locale === 'ua' ? 'СТОП / ФІНІШ' : 'STOP / FINISH'"
              icon="pi pi-stop-circle"
              severity="danger"
              class="w-full py-3 font-bold text-lg pointer-events-none"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- STAGE OR COMPETITION COMPLETED STATE (When 0 active timers) -->
    <div v-else class="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full my-6 text-center">
      <!-- ALL TOURNAMENT FINISHED! -->
      <Card v-if="isAllCompetitionCompleted || (isCurrentStageFinished && isFinalStage)" class="w-full py-10 border-2 border-amber-500 shadow-xl">
        <template #content>
          <div class="w-20 h-20 rounded-full bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center text-4xl mb-4">
            <i class="pi pi-trophy"></i>
          </div>

          <h2 class="text-3xl font-black text-surface-900 dark:text-surface-0 mb-2">
            {{ locale === 'ua' ? '🏆 Змагання повністю завершено!' : '🏆 Competition Completed!' }}
          </h2>

          <p class="text-surface-600 dark:text-surface-400 text-sm mb-6 max-w-md mx-auto">
            {{ locale === 'ua'
              ? 'Усі заїзди та етапи турніру фінішували. Підсумкова таблиця результатів сформована!'
              : 'All stages and runs of this tournament have finished. Final leaderboard is ready!' }}
          </p>

          <div class="flex items-center justify-center gap-3 flex-wrap">
            <Button
              @click.prevent="goToResults"
              :label="locale === 'ua' ? 'Переглянути результати турніру' : 'View Tournament Results'"
              icon="pi pi-trophy"
              severity="warn"
              class="font-bold py-3 px-6 shadow-md"
            />
            <Button
              @click.prevent="$router.push({ name: 'timekeeping' })"
              :label="locale === 'ua' ? 'Панель суддівства' : 'Timekeeping'"
              icon="pi pi-arrow-left"
              severity="secondary"
              outlined
            />
          </div>
        </template>
      </Card>

      <!-- CURRENT STAGE FINISHED, BUT NEXT STAGE EXISTS -->
      <Card v-else-if="isCurrentStageFinished && nextStage" class="w-full py-10 border-2 border-green-500 shadow-lg">
        <template #content>
          <div class="w-16 h-16 rounded-full bg-green-500/10 text-green-500 mx-auto flex items-center justify-center text-3xl mb-3">
            <i class="pi pi-check-circle"></i>
          </div>

          <h3 class="text-2xl font-bold text-surface-900 dark:text-surface-0 mb-2">
            {{ locale === 'ua' ? `🏁 Етап «${currentStage?.name}» завершено!` : `🏁 Stage "${currentStage?.name}" Finished!` }}
          </h3>

          <p class="text-surface-600 dark:text-surface-400 text-sm mb-6 max-w-md mx-auto">
            {{ locale === 'ua'
              ? `Усі учасники цього етапу фінішували. Перейдіть до фінішу наступного етапу: «${nextStage.name}».`
              : `All riders of this stage have finished. You can now switch to next stage: "${nextStage.name}".` }}
          </p>

          <div class="flex items-center justify-center gap-3 flex-wrap">
            <Button
              @click.prevent="switchToNextStage"
              :label="locale === 'ua' ? `Фініш етапу: ${nextStage.name} →` : `Finish next: ${nextStage.name} →`"
              icon="pi pi-arrow-right"
              iconPos="right"
              severity="success"
              class="font-bold py-3 px-6 shadow-md"
            />
            <Button
              @click.prevent="goToResults"
              :label="locale === 'ua' ? 'Проміжні результати' : 'Interim Results'"
              icon="pi pi-trophy"
              severity="secondary"
              outlined
            />
          </div>
        </template>
      </Card>

      <!-- WAITING FOR START (No riders on track yet) -->
      <Card v-else class="w-full py-12 border border-surface-200 dark:border-surface-800">
        <template #content>
          <i class="pi pi-clock text-5xl text-surface-400 mb-3 block animate-spin-slow"></i>
          <h3 class="text-xl font-bold text-surface-900 dark:text-surface-0 mb-2">
            {{ locale === 'ua' ? 'Очікування старту заїздів...' : 'Waiting for riders to start...' }}
          </h3>
          <p class="text-sm text-surface-500 dark:text-surface-400 max-w-md mx-auto mb-4">
            {{ locale === 'ua'
              ? 'На трасі зараз немає активних учасників. Щойно суддя на старті запустить райдера, його номер зʼявиться тут для фіксації фінішу.'
              : 'No active riders on track. When the start judge releases a rider, their number will appear here.' }}
          </p>
        </template>
      </Card>
    </div>

    <!-- Recently Finished Riders Log -->
    <div v-if="recentFinishedList.length" class="w-full max-w-3xl mx-auto mt-6">
      <div class="text-xs uppercase font-semibold text-surface-500 dark:text-surface-400 mb-2 flex items-center justify-between">
        <span>{{ locale === 'ua' ? 'Щойно фінішували:' : 'Recently finished:' }}</span>
        <span class="text-surface-400">{{ locale === 'ua' ? 'Останні результати' : 'Latest records' }}</span>
      </div>

      <div class="flex flex-col gap-1.5">
        <div
          v-for="rider in recentFinishedList"
          :key="rider.id"
          class="flex items-center justify-between bg-surface-50 dark:bg-surface-800/60 px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 text-sm"
        >
          <div class="flex items-center gap-2">
            <span class="font-mono font-bold text-primary-600 dark:text-primary-400">#{{ rider.competitorNumber }}</span>
            <span class="font-medium text-surface-900 dark:text-surface-0">{{ rider.secondName }} {{ rider.name }}</span>
          </div>

          <div class="flex items-center gap-3">
            <span class="font-mono font-bold text-surface-700 dark:text-surface-300">
              {{ computeDuration(rider.startTime, rider.finishTime) }}
            </span>
            <Tag :value="rider.category || '—'" severity="secondary" class="text-[11px] uppercase" />
          </div>
        </div>
      </div>
    </div>

    <Toast position="bottom-right" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, useTemplateRef } from 'vue'
import { useFullscreen } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'
import { useTimersStore } from '@/stores/timers.js'
import { useCompetitorsStore } from '@/stores/competitors.js'
import { useCompetitionsStore } from '@/stores/competitions.js'
import { useStagesStore } from '@/stores/stages.js'
import AppBreadcrumb from '@/components/navigation/AppBreadcrumb.vue'

const route = useRoute()
const router = useRouter()
const { locale } = useI18n()
const toast = useToast()

const competitorsStore = useCompetitorsStore()
const timerStore = useTimersStore()
const competitionsStore = useCompetitionsStore()
const stagesStore = useStagesStore()

const competition = ref(null)
const selectedStageId = ref(null)
let unsubscribeCompetitors = null

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
    label: locale === 'ua' ? 'Фінішний створ' : 'Finish Gate',
  },
])

const sortedStages = computed(() => {
  return [...stagesStore.stages].sort((a, b) => (Number(a.number) || 0) - (Number(b.number) || 0))
})

const currentStageIndex = computed(() => {
  if (!selectedStageId.value) return 0
  return sortedStages.value.findIndex((s) => s.id === selectedStageId.value)
})

const currentStage = computed(() => {
  if (currentStageIndex.value >= 0 && currentStageIndex.value < sortedStages.value.length) {
    return sortedStages.value[currentStageIndex.value]
  }
  return sortedStages.value[0] || null
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

// Active timers matching this competition (and selected stage if present)
const activeTimers = computed(() => {
  return timerStore.timers.filter((t) => {
    if (selectedStageId.value && t.stageId) {
      return t.stageId === selectedStageId.value
    }
    return true
  })
})

// Competitors for the active stage
const stageCompetitors = computed(() => {
  const currentId = selectedStageId.value || currentStage.value?.id
  if (!currentId) return competitorsStore.competitionCompetitors
  return competitorsStore.competitionCompetitors.filter((c) => c.stageId === currentId)
})

const totalStageCompetitorsCount = computed(() => stageCompetitors.value.length)

const finishedCompetitorsCount = computed(() => {
  return stageCompetitors.value.filter((c) => c.finishTime != null).length
})

// Is start closed for current stage? (no one left waiting without start/DNS)
const isStartClosed = computed(() => {
  if (stageCompetitors.value.length === 0) return false
  return stageCompetitors.value.every((c) => c.started || c.status === 'DNS')
})

// Is current stage finished? (start is closed, no one on track, at least 1 competitor)
const isCurrentStageFinished = computed(() => {
  if (stageCompetitors.value.length === 0) return false
  return isStartClosed.value && activeTimers.value.length === 0
})

// Is ALL competition completed? (all stages have 0 waiting, 0 active timers, and final stage finished)
const isAllCompetitionCompleted = computed(() => {
  if (sortedStages.value.length === 0 || competitorsStore.competitionCompetitors.length === 0) {
    return false
  }
  const allStartedOrDns = competitorsStore.competitionCompetitors.every((c) => c.started || c.status === 'DNS')
  const allFinishedOrDns = competitorsStore.competitionCompetitors.every((c) => c.finishTime != null || c.status === 'DNS' || !c.started)
  const noActiveTimers = timerStore.timers.length === 0

  return allStartedOrDns && allFinishedOrDns && noActiveTimers
})

const recentFinishedList = computed(() => {
  return [...stageCompetitors.value]
    .filter((c) => c.finishTime != null)
    .sort((a, b) => (b.finishTime || 0) - (a.finishTime || 0))
    .slice(0, 5)
})

const getCompetitorName = (competitorId) => {
  const rider = competitorsStore.competitionCompetitors.find((c) => c.id === competitorId)
  return rider ? `${rider.secondName} ${rider.name}` : ''
}

const computeDuration = (start, finish) => {
  if (!start || !finish) return '—'
  const diff = Math.max(0, finish - start)
  const minutes = Math.floor(diff / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  const hundredths = Math.floor((diff % 1000) / 10)
  const pad = (n, len = 2) => String(n).padStart(len, '0')
  return `${pad(minutes)}:${pad(seconds)}.${pad(hundredths)}`
}

const playFinishBeep = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const osc = audioContext.createOscillator()
    const gain = audioContext.createGain()
    osc.connect(gain)
    gain.connect(audioContext.destination)
    osc.frequency.value = 1500
    osc.start()
    setTimeout(() => {
      osc.stop()
      audioContext.close()
    }, 400)
  } catch (e) {
    console.error('Audio beep error:', e)
  }
}

const stopTimer = async (timer) => {
  const timestamp = Date.now()
  playFinishBeep()

  await competitorsStore.updateFinishTime(timer.competitorId, timestamp)
  await timerStore.stopTimer(timer.id)

  toast.add({
    severity: 'success',
    summary: locale.value === 'ua' ? 'ФІНІШ' : 'FINISH',
    detail: locale.value === 'ua'
      ? `Час для #${timer.number} зафіксовано!`
      : `Time recorded for #${timer.number}!`,
    life: 2500,
  })
}

const switchToNextStage = () => {
  if (nextStage.value) {
    selectedStageId.value = nextStage.value.id
  }
}

const goToResults = () => {
  router.push({ name: 'competition-results', params: { id: route.params.id } })
}

onMounted(async () => {
  competition.value = await competitionsStore.getCompetitionById(route.params.id)
  await stagesStore.getStages(route.params.id)

  if (sortedStages.value.length > 0) {
    selectedStageId.value = sortedStages.value[0].id
  }

  await timerStore.getTimers(route.params.id)

  const stageIds = stagesStore.stages.map((s) => s.id)
  if (stageIds.length > 0) {
    unsubscribeCompetitors = competitorsStore.subscribeToCompetitionCompetitors(stageIds)
  }
})

onUnmounted(() => {
  if (unsubscribeCompetitors) {
    unsubscribeCompetitors()
  }
})
</script>

<style scoped>
.full {
  background-color: var(--p-surface-0);
  padding: 1rem;
}
</style>
