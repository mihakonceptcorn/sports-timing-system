<template>
  <Card class="relative">
    <template #content>
      <Button
        @click.prevent="$router.push({name: 'competitions'})"
        label="Go Back"
        icon="pi pi-arrow-left"
        class="mb-6"
      />

      <h3 class="text-xl" v-if="competition">{{ competition.name }}</h3>

      <SpeedDial :model="actions" direction="down" class="absolute! top-4 right-4" />

      <Tabs value="0">
        <TabList>
          <Tab value="0">Competition</Tab>
          <Tab value="1">Stages</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="0">
            <Card v-if="competition">
              <template #title>{{ competition.name }}</template>
              <template #content>
                <p>country: <span class="font-bold">{{ competition.country }}</span></p>
                <p>city: <span class="font-bold">{{ competition.city }}</span></p>
                <p>location: <span class="font-bold">{{ competition.location }}</span></p>
                <p>date: <span class="font-bold">{{ competition.date }}</span></p>
                <p>stages: <span class="font-bold">{{ competition.stages }}</span></p>
                <p>description: <span class="font-bold">{{ competition.description }}</span></p>
              </template>
            </Card>
          </TabPanel>

          <TabPanel value="1">
            <Button
              @click.prevent="visible = true"
              label="Create stage"
              icon="pi pi-plus"
            />

            <StagesView />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <div class="mt-6 flex gap-2 flex-wrap" v-if="competition">
        <div v-if="competition.timekeeper">Timekeeper: {{ competition.timekeeper }}</div>
        <div v-else>
          <InputText name="email" type="text" placeholder="Email" v-model="email" class="mr-1"/>
          <Button
            @click.prevent="addTimekeeper"
            label="Add Timekeeper"
            icon="pi pi-user-plus"
            severity="warn"
          />
        </div>
      </div>

      <Dialog v-model:visible="visible" modal header="Create stage" :style="{ width: '25rem' }">
        <div class="flex items-center gap-4 mb-4">
          <label for="stageNumber" class="font-semibold w-24">Stage number</label>
          <InputNumber v-model="stageData.number" id="stageNumber" class="flex-auto" autocomplete="off"/>
        </div>
        <div class="flex items-center gap-4 mb-8">
          <label for="stageName" class="font-semibold w-24">Name</label>
          <InputText v-model="stageData.name" id="stageName" class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex justify-end gap-2">
          <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
          <Button type="button" label="Create" @click="createStage"></Button>
        </div>
      </Dialog>

      <Toast position="bottom-right"/>
      <ConfirmDialog />
    </template>
  </Card>
</template>

<script setup>
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, reactive } from 'vue';
import { useCompetitionsStore } from '@/stores/competitions.js'
import { useStagesStore } from '@/stores/stages.js'
import StagesView from '@/views/competitions/StagesView.vue'

const route = useRoute()
const router = useRouter()
const competitionsStore = useCompetitionsStore()
const stagesStore = useStagesStore()
const confirm = useConfirm()
const toast = useToast()

const competition = ref(null)
const email = ref('')
const visible = ref(false)
const stageData = reactive({
  number: 1,
  name: ''
})

const confirmDialog = () => {
  confirm.require({
    message: `Do you want to delete this competition?`,
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
      competitionsStore.deleteCompetition(route.params.id)
      router.push({name: 'competitions'})
      toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 })
    },
    reject: () => {
      toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 })
    },
  });
};

const actions = ref([
  {
    label: 'Edit',
    icon: 'pi pi-pencil',
    command: () => {
      router.push({ name: 'competition-edit', params: { id: route.params.id } })
    }
  },
  {
    label: 'Delete',
    icon: 'pi pi-trash',
    command: () => {
      confirmDialog()
    }
  }
])

onMounted(async () => {
  competition.value = await competitionsStore.getCompetitionById(route.params.id)
  await stagesStore.getStages(route.params.id)
})

const createStage = () => {
  visible.value = false
  stagesStore.createStage(route.params.id, stageData.number, stageData.name)
}

const addTimekeeper = () => {
  competitionsStore.addTimekeeper(route.params.id, email.value)
}

</script>

<style scoped lang="scss">

</style>
