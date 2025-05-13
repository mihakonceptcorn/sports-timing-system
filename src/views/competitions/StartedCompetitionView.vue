<template>
  <div
    :class="{'full': isFullscreen}"
    ref="fullscreen"
    class="started-competition w-full"
  >
    <Button
      label="Go back"
      @click.prevent="$router.go(-1)"
      severity="danger"
      size="small"
      class="mr-2"
    />
    <Button label="Full screen" @click.prevent="toggleFullScreen" size="small"/>

    <Divider />

    <div class="flex justify-center">
      <div
        v-if="timerStore.timers.length"
        v-for="timer in timerStore.timers"
        class="flex text-7xl justify-center items-center timer-item m-10"
      >
        {{ competitorsStore.competitors.filter(c => c.id === timer.competitorId)[0].competitorNumber }}
      </div>
    </div>

    <Divider />

    <div class="mt-10 flex">
      <Button
        v-for="competitor in competitorsStore.competitors.filter(c => c.started === false).reverse()"
        @click="createTimer(competitor.id)"
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
import { onMounted, useTemplateRef } from 'vue'
import { useFullscreen } from '@vueuse/core'
import { useRoute } from 'vue-router'

const competitorsStore = useCompetitorsStore()
const timerStore = useTimersStore()
const route = useRoute()

const el = useTemplateRef('fullscreen')
const { isFullscreen, enter, exit, toggle } = useFullscreen(el)

const toggleFullScreen = () => {
  toggle()
}

const createTimer = (competitorId) => {
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
      case 3:
        const timestamp = Date.now()
        timerStore.createTimer(route.params.stageId, competitorId)
        competitorsStore.updateStartTime(competitorId, timestamp)
        activeBtnLabel.innerText = 'GO!!!'
        break
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
  await competitorsStore.getCompetitors(route.params.stageId)
  await timerStore.getTimers(route.params.stageId)
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
