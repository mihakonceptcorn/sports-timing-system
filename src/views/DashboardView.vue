<template>
  <Card>
    <template #content>
      <FullCalendar :options='calendarOptions'></FullCalendar>
    </template>
  </Card>
</template>

<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import { computed, reactive } from 'vue';
import { useCompetitionsStore } from '@/stores/competitions.js'

const competitionsStore = useCompetitionsStore()

const events = computed(() => {
  const events = []

  competitionsStore.competitions.forEach((competition) => {
    events.push({
      title: competition.name,
      start: new Date(competition.date),
    })
  })

  return events
})

const calendarOptions = reactive(
  {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    height: 600,
    weekends: true,
    events: events
  }
)

</script>

<style scoped lang="scss">

</style>
