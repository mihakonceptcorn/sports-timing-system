<template>
  <div
    :class="{'full': isFullscreen}"
    ref="fullscreen"
    class="started-competition w-full"
  >
    <AppBreadcrumb v-if="!isFullscreen" :items="breadcrumbItems" />

    <Button
      label="Go back"
      @click.prevent="$router.push({ name: 'stage-preview', params: { id: $route.params.id, stageId: $route.params.stageId } })"
      severity="danger"
      size="small"
      class="mr-2"
    />
    <Button label="Full screen" @click.prevent="toggleFullScreen" size="small"/>

    <Divider />

    <div class="flex justify-center" v-if="timerStore.timers.length">
      <div
        v-for="timer in timerStore.timers"
        :key="timer.id"
        class="flex text-7xl justify-center items-center timer-item m-10"
      >
        {{ competitorsStore.competitors.filter(c => c.id === timer.competitorId)[0]?.competitorNumber }}
      </div>
    </div>

    <Divider />

    <div class="mt-10 flex">
      <Button
        v-for="competitor in competitorsStore.competitors.filter(c => c.started === false).reverse()"
        :key="competitor.id"
        @click="createTimer(competitor)"
        :label="competitor.name + ' -- ' + competitor.competitorNumber"
        :fluid="false"
        severity="success"
        size="small"
        class="start-timer-button mb-2 mr-2"
      />
    </div>
  </div>
</template>

<script setup>
import { useCompetitorsStore } from '@/stores/competitors.js'
import { useTimersStore } from '@/stores/timers.js'
import { useCompetitionsStore } from '@/stores/competitions.js'
import { useStagesStore } from '@/stores/stages.js'
import { onMounted, ref, computed, useTemplateRef } from 'vue'
import { useFullscreen } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AppBreadcrumb from '@/components/navigation/AppBreadcrumb.vue'

const competitorsStore = useCompetitorsStore()
const timerStore = useTimersStore()
const competitionsStore = useCompetitionsStore()
const stagesStore = useStagesStore()
const route = useRoute()
const { locale } = useI18n()

const competition = ref(null)
const stage = ref(null)

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
    label: locale.value === 'ua' ? 'Старт заїзду' : 'Timer',
  },
])

const el = useTemplateRef('fullscreen')
const { isFullscreen, toggle } = useFullscreen(el)

const toggleFullScreen = () => {
  toggle()
}

const createTimer = (competitor) => {
  let i = 0;

  const beeper = setInterval(() => {
    const activeBtn = document.querySelector('.start-timer-button:last-child')
    const activeBtnLabel = activeBtn.querySelector('.p-button-label')

    switch (i) {
      case 0:
        activeBtnLabel.innerText = '3'
        break
      case 1:
        activeBtnLabel.innerText = '2'
        break
      case 2:
        activeBtnLabel.innerText = '1'
        break
      case 3: {
        const timestamp = Date.now()
        timerStore.createTimer(route.params.id, route.params.stageId, competitor.id, competitor.competitorNumber)
        competitorsStore.updateStartTime(competitor.id, timestamp)
        activeBtnLabel.innerText = 'GO!!!'
        break
      }
    }

    const audioContext = new AudioContext()
    const oscillator = audioContext.createOscillator()

    oscillator.connect(audioContext.destination)
    oscillator.frequency.value = i === 3 ? 2000 : 1000

    oscillator.start()
    setTimeout(() => {
      oscillator.stop()
    }, i === 3 ? 800 : 300)

    i++
    if (i === 4) clearInterval(beeper)
  }, 1000)
}

onMounted(async () => {
  competition.value = await competitionsStore.getCompetitionById(route.params.id)
  stage.value = await stagesStore.getStageById(route.params.stageId)
  await competitorsStore.getCompetitors(route.params.stageId)
  await timerStore.getTimers(route.params.id)
})
</script>

<style lang="scss">
.full {
  background-color: white;
  padding: 20px;
}

.timer-item {
  width: 200px;
  height: 200px;
  background-color: red;
  color: white;
}

.start-timer-button {
  width: 50px;
  pointer-events: none;
  &:last-child {
    width: 100%;
    height: 200px;
    pointer-events: all;
    position: absolute !important;
    left: 0;
    bottom: 40px;
    border: solid 4px green;
    z-index: 999;
    font-size: 50px;
  }
}
</style>
