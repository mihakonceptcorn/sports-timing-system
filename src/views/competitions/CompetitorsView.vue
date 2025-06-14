<template>
  <div class="competitors mt-6" v-if="competitorsStore.competitors?.length">
    <DataTable
      :value="competitorsData"
      dataKey="id"
      tableStyle="min-width: 15rem"
      removableSort
    >
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
      <Column field="time" header="Time"></Column>
      <Column field="position" header="Position" :sortable="true">
        <template #body="slotProps">
          {{ slotProps.data.position ? slotProps.data.position : '--' }}
        </template>
      </Column>
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
import { computed } from 'vue'
import { useCompetitorsStore } from '@/stores/competitors.js'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

const competitorsStore = useCompetitorsStore()
const router = useRouter()
const confirm = useConfirm()
const toast = useToast()

let deleteId = null

const competitorsData = computed(() => {
  const competitors = competitorsStore.competitors

  competitors.forEach(competitor => {
    competitor.time = getTime(competitor.startTime, competitor.finishTime)
  })

  competitors.forEach(competitor => {
    competitor.position = getPosition(competitor.id)
  })

  return competitors
})

const getTime = (start, finish) => {
  if (!start || !finish) return  '--'

  const diff = finish - start

  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  const hundredths = Math.floor((diff % 1000) / 10);

  return  hours + ':' + minutes + ':' + seconds + '.' + hundredths
}

const getPosition = (id) => {
  let competitorsMap = competitorsStore.competitors.map(c => {
    return {
      id: c.id,
      time: c.finishTime - c.startTime
    }
  })

  competitorsMap = competitorsMap.filter(c => !isNaN(c.time))

  competitorsMap.sort((a, b) => a.time - b.time)

  const idx = competitorsMap.findIndex(c => c.id === id)

  return (idx !== -1) ? idx + 1 : null
}

const goToEdit = (id) => {
  router.push({name: 'competitor-edit', params: { competitorId: id }})
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
