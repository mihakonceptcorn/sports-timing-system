<template>
  <div class="competitors mt-6">
    <DataTable
      v-model:selection="selectedCompetitors"
      :value="competitorsStore.competitors"
      dataKey="id"
      tableStyle="min-width: 15rem"
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
  </div>
</template>

<script setup>
import { useCompetitorsStore } from '@/stores/competitors.js'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

const competitorsStore = useCompetitorsStore()
const router = useRouter()
const confirm = useConfirm()
const toast = useToast()

const selectedCompetitors = ref()
let deleteId = null

const getTime = (start, finish) => {
  if (!start || !finish) return  '--'

  const diff = finish - start

  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  const hundredths = Math.floor((diff % 1000) / 10);

  return  hours + ':' + minutes + ':' + seconds + '.' + hundredths
}

const goToEdit = (id) => {
  // router.push({name: 'stage-edit', params: { stageId: id }})
}

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
      competitorsStore.deleteCompetitor(deleteId)
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
</script>

<style scoped lang="scss">

</style>
