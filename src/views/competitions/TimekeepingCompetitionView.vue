<template>
  <div
    :class="{'full': isFullscreen}"
    class="timekeepingCompetition w-full"
    ref="fullscreen"
  >
    <h3 class="text-3xl" >Timekeeping</h3>
    <Button label="Full screen" @click.prevent="toggleFullScreen"/>
    <div>
      Comp ---- {{ $route.params.id }}

      <div class="flex justify-center w-full">
        <div
          @click="stopTimer(timer.id, timer.competitorId)"
          v-if="timerStore.timers.length"
          v-for="timer in timerStore.timers"
          class="flex text-7xl justify-center items-center timer-item m-10 w-full"
        >
          {{ competitorsStore.competitors.filter(c => c.id === timer.competitorId)[0].competitorNumber }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, useTemplateRef} from 'vue'
import { useFullscreen } from '@vueuse/core'
import { useTimersStore } from '@/stores/timers.js'
import { useCompetitorsStore } from '@/stores/competitors.js'
import { useRoute } from 'vue-router'

const competitorsStore = useCompetitorsStore()
const timerStore = useTimersStore()
const route = useRoute()

const el = useTemplateRef('fullscreen')
const { isFullscreen, enter, exit, toggle } = useFullscreen(el)

const toggleFullScreen = () => {
  toggle()
}

const stopTimer = (timerId, competitorId) => {
  const timestamp = Date.now()

  competitorsStore.updateFinishTime(competitorId, timestamp)

  timerStore.stopTimer(timerId)
}

onMounted(async () => {
  await competitorsStore.getCompetitors(route.params.id)
  await timerStore.getTimers(route.params.id)
})
</script>

<style scoped lang="scss">
.full {
  background-color: white;
  padding: 20px;
}

.timer-item {
  height: 300px;
  background-color: green;
  color: white;
  cursor: pointer;
  position: absolute;
  bottom: 40px;
}
</style>
