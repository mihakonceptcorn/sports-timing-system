<template>
  <div
    :class="{'full': isFullscreen}"
    ref="fullscreen"
    class="started-competition w-full"
  >
    <Button label="Full screen" @click.prevent="toggleFullScreen" size="small"/>

    <Divider />

    <div
      v-for="competitor in competitorsStore.competitors"
      class="button mt-10"
    >
      <Button
        @click.prevent="createTimer(competitor.id)"
        :label="competitor.name + ' -- ' + competitor.competitorNumber"
        :fluid="true"
        severity="warn"
        size="large"
      />
    </div>
  </div>
</template>

<script setup>
import { useCompetitorsStore } from '@/stores/competitors.js'
import { onMounted, useTemplateRef } from 'vue'
import { useFullscreen } from '@vueuse/core'
import { useRoute } from 'vue-router'

const competitorsStore = useCompetitorsStore()
const route = useRoute()

const el = useTemplateRef('fullscreen')
const { isFullscreen, enter, exit, toggle } = useFullscreen(el)

const toggleFullScreen = () => {
  toggle()
}

const createTimer = (id) => {
  const timestamp = Date.now()

  // competitorsStore.updateStartTime(id, timestamp)
}

onMounted(async () => {
  await competitorsStore.getCompetitors(route.params.id)
})
</script>

<style scoped lang="scss">
.full {
  background-color: white;
  padding: 20px;
}
</style>
