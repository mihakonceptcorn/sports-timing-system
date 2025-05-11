<template>
  <Card class="mt-6">
    <template #content>
      <FullCalendar :options='calendarOptions' />
    </template>
  </Card>
</template>

<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import { reactive } from 'vue'

const calendarOptions = reactive(
  {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    weekends: true,
    events: [
      { title: 'Meeting', start: new Date() }
    ]
  }
)

</script>

<style scoped lang="scss">

</style>
