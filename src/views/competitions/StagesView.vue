<template>
  <div class="competitors mt-6">
    <DataTable
      v-model:selection="selectedStages"
      :value="stagesStore.stages"
      dataKey="id"
      tableStyle="min-width: 15rem"
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
  </div>
</template>

<script setup>
import { useStagesStore } from '@/stores/stages.js'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

const stagesStore = useStagesStore()
const router = useRouter()
const confirm = useConfirm()
const toast = useToast()

const selectedStages = ref()
let deleteId = null

const goToEdit = (id) => {
  router.push({name: 'stage-edit', params: { stageId: id }})
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
      stagesStore.deleteStage(deleteId)
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
  })
}
</script>

<style scoped lang="scss">

</style>
