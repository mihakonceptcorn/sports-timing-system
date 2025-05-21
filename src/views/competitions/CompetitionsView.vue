<template>
  <Card v-if="competitionsStore.competitions.length" class="mb-6">
    <template #title>Competitions</template>
    <template #content>
      <DataTable
        v-model:selection="selectedCompetitions"
        :value="competitionsStore.competitions"
        dataKey="id"
        tableStyle="min-width: 15rem"
      >
        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
        <Column field="id" header="Id">
          <template #body="slotProps">
            <a
              @click.prevent="goToPreview(slotProps.data.id)"
              class="text-green-600 cursor-pointer"
            >
              {{ slotProps.data.id.slice(0, 5) + '...' }}
            </a>
          </template>
        </Column>
        <Column field="name" header="Name"></Column>
        <Column field="date" header="Date">
          <template #body="slotProps">
            {{ getDate(slotProps.data.date) }}
          </template>
        </Column>
        <Column field="country" header="Country"></Column>
        <Column field="city" header="City"></Column>
        <Column field="location" header="Location"></Column>
        <Column field="action" header="Actions">
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              rounded
              aria-label="Filter"
              variant="outlined"
              size="small"
              @click.prevent="goToEdit(slotProps.data.id)"
            />
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
  <Card v-else>
    <template #title>There are no competitions here yet.</template>
    <template #content>
      <p>Go ahead and create the first one!</p>
    </template>
  </Card>
</template>

<script setup>
import { useCompetitionsStore} from '@/stores/competitions.js'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const competitionsStore = useCompetitionsStore()
const router = useRouter()

const selectedCompetitions = ref();

const getDate = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString()
}
const goToPreview = (id) => {
  router.push({name: 'competition-preview', params: { id }})
}

const goToEdit = (id) => {
  router.push({name: 'competition-edit', params: { id }})
}

</script>

<style scoped lang="scss">

</style>
