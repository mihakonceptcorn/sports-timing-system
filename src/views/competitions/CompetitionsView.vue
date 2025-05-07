<template>
  <div class="competitions">
    <h3 class="text-2xl">Competitions</h3>
    <div class="card" v-if="competitionsStore.competitions.length">
      <DataTable
        v-model:selection="selectedCompetitions"
        :value="competitionsStore.competitions"
        dataKey="id"
        tableStyle="min-width: 50rem"
      >
        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
        <Column field="name" header="Name"></Column>
        <Column field="date" header="date"></Column>
        <Column field="stages" header="stages"></Column>
        <Column field="country" header="country"></Column>
        <Column field="city" header="city"></Column>
        <Column field="location" header="location"></Column>
        <Column field="description" header="description"></Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { useCompetitionsStore} from '@/stores/competitions.js'
import { ref } from 'vue'

const competitionsStore = useCompetitionsStore()

const selectedCompetitions = ref();

</script>

<style scoped lang="scss">

</style>
