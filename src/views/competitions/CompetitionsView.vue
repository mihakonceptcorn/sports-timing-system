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
            <div style="min-width: 72px">
              <Button
                icon="pi pi-pencil"
                rounded
                aria-label="Filter"
                variant="outlined"
                size="small"
                @click.prevent="goToEdit(slotProps.data.id)"
              />
              <Button
                @click.prevent="confirmDialog(slotProps.data.id, slotProps.data.name)"
                icon="pi pi-times"
                rounded
                aria-label="Filter"
                variant="outlined"
                size="small"
                severity="danger"
                class="ml-2"
              />
            </div>
          </template>
        </Column>
      </DataTable>

      <Toast position="bottom-right"/>
      <ConfirmDialog />
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
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { useCompetitionsStore } from '@/stores/competitions.js'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const competitionsStore = useCompetitionsStore()
const router = useRouter()
const confirm = useConfirm()
const toast = useToast()

const selectedCompetitions = ref()
let deleteId = null

const confirmDialog = (id, name) => {
  deleteId = id
  confirm.require({
    message: `Do you want to delete '${name}'?`,
    header: 'Danger Zone',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger',
    },
    accept: () => {
      competitionsStore.deleteCompetition(deleteId)
      toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 })
      deleteId = null
    },
    reject: () => {
      toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 })
      deleteId = null
    },
    onHide: () => {
      deleteId = null
    }
  });
};

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
