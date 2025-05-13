<template>
  <div class="competitors mt-6">
    <DataTable
      v-model:selection="selectedCompetitors"
      :value="competitorsStore.competitors"
      dataKey="id"
      tableStyle="min-width: 50rem"
    >
      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
      <Column field="id" header="Id">
        <template #body="slotProps">
          <a
            class="text-green-600 cursor-pointer"
          >
            {{ slotProps.data.id.slice(0, 5) + '...' }}
          </a>
        </template>
      </Column>
      <Column field="name" header="Name"></Column>
      <Column field="secondName" header="Second Name"></Column>
      <Column field="gender" header="Gender"></Column>
      <Column field="category" header="Category"></Column>
      <Column field="team" header="Team"></Column>
      <Column field="competitorNumber" header="Number"></Column>
      <Column field="time" header="Time">
        <template #body="slotProps">
          {{ getTime(slotProps.data.startTime, slotProps.data.finishTime) }}
        </template>
      </Column>
      <Column field="position" header="Position"></Column>
    </DataTable>
  </div>
</template>

<script setup>
import { useCompetitorsStore } from '@/stores/competitors.js'
import { ref } from 'vue'

const competitorsStore = useCompetitorsStore()

const selectedCompetitors = ref();

const getTime = (start, finish) => {
  if (!start || !finish) return  '--'

  const diff = finish - start

  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  const hundredths = Math.floor((diff % 1000) / 10);

  return  hours + ':' + minutes + ':' + seconds + '.' + hundredths
}
</script>

<style scoped lang="scss">

</style>
