<template>
  <div class="bg-surface-50 dark:bg-surface-950 px-6 py-8 md:px-12 lg:px-20">
    <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
      <div class="bg-surface-0 dark:bg-surface-900 shadow-sm p-5 rounded-2xl">
        <div class="flex justify-between gap-4">
          <div class="flex flex-col gap-2 cursor-pointer" @click="$router.push({name: 'competitions'})">
            <span class="text-surface-700 dark:text-surface-300 font-normal leading-tight">Active Competitions</span>
            <div class="text-surface-900 dark:text-surface-0 font-semibold !text-2xl !leading-tight">0</div>
          </div>
          <div class="flex items-center justify-center bg-gradient-to-b from-cyan-400 dark:from-cyan-300 to-cyan-600 dark:to-cyan-500 rounded-lg w-10 h-10">
            <i class="pi pi-trophy text-surface-0 dark:text-surface-900 !text-xl !leading-none" />
          </div>
        </div>
      </div>

      <div class="bg-surface-0 dark:bg-surface-900 shadow-sm p-5 rounded-2xl">
        <div class="flex justify-between gap-4">
          <div class="flex flex-col gap-2">
            <span class="text-surface-700 dark:text-surface-300 font-normal leading-tight">Finished Competitions</span>
            <div class="text-surface-900 dark:text-surface-0 font-semibold !text-2xl !leading-tight">0</div>
          </div>
          <div class="flex items-center justify-center bg-gradient-to-b from-orange-400 dark:from-orange-300 to-orange-600 dark:to-orange-500 rounded-lg w-10 h-10">
            <i class="pi pi-trophy text-surface-0 dark:text-surface-900 !text-xl !leading-none" />
          </div>
        </div>
      </div>

      <div class="bg-surface-0 dark:bg-surface-900 shadow-sm p-5 rounded-2xl">
        <div class="flex justify-between gap-4">
          <div class="flex flex-col gap-2">
            <span class="text-surface-700 dark:text-surface-300 font-normal leading-tight">Canceled Competitions</span>
            <div class="text-surface-900 dark:text-surface-0 font-semibold !text-2xl !leading-tight">0</div>
          </div>
          <div class="flex items-center justify-center bg-gradient-to-b from-slate-400 dark:from-slate-300 to-slate-600 dark:to-slate-500 rounded-lg w-10 h-10">
            <i class="pi pi-file text-surface-0 dark:text-surface-900 !text-xl !leading-none" />
          </div>
        </div>
      </div>

      <div class="bg-surface-0 dark:bg-surface-900 shadow-sm p-5 rounded-2xl">
        <div class="flex justify-between gap-4">
          <div class="flex flex-col gap-2">
            <span class="text-surface-700 dark:text-surface-300 font-normal leading-tight">Total Competitors</span>
            <div class="text-surface-900 dark:text-surface-0 font-semibold !text-2xl !leading-tight">0</div>
          </div>
          <div class="flex items-center justify-center bg-gradient-to-b from-violet-400 dark:from-violet-300 to-violet-600 dark:to-violet-500 rounded-lg w-10 h-10">
            <i class="pi pi-users text-surface-0 dark:text-surface-900 !text-xl !leading-none" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <Card class="mt-6">
    <template #title>Sports Timing System</template>
    <template #content>
      <p class="m-0">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque
        quas!
      </p>
    </template>
  </Card>

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
