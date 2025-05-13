<template>
  <div class="competitors mt-6">
    <DataTable
      v-model:selection="selectedStages"
      :value="stagesStore.stages"
      dataKey="id"
      tableStyle="min-width: 50rem"
    >
      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
      <Column field="id" header="Id">
        <template #body="slotProps">
          <a
            @click.prevent="$router.push({ name: 'stage-preview', params: { id: $route.params.id, stageId: slotProps.data.id } })"
            class="text-green-600 cursor-pointer"
          >
            {{ slotProps.data.id.slice(0, 5) + '...' }}
          </a>
        </template>
      </Column>
      <Column field="number" header="Number"></Column>
      <Column field="name" header="Name"></Column>
    </DataTable>
  </div>
</template>

<script setup>
import { useStagesStore } from '@/stores/stages.js'
import { ref } from 'vue'

const stagesStore = useStagesStore()

const selectedStages = ref();
</script>

<style scoped lang="scss">

</style>
