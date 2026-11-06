<template>
  <Card class="relative">
    <template #content>
      <div class="flex items-center justify-between mb-6 flex-wrap gap-2">
        <div class="flex items-center gap-2 flex-wrap">
          <Button
            @click.prevent="$router.push({name: 'competitions'})"
            label="Go Back"
            icon="pi pi-arrow-left"
          />
          <Button
            @click.prevent="goToResults"
            label="Переглянути результати"
            icon="pi pi-trophy"
            severity="success"
          />
        </div>
      </div>

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
                <p>type: <span class="font-bold">{{ competitionTypeLabel(competition.type, { locale }) }}</span></p>
                <p v-if="competition.type === COMPETITION_TYPE.BEST_OF_N">
                  runs: <span class="font-bold">{{ competition.runsCount }}</span>
                </p>
                <p>stages: <span class="font-bold">{{ competition.stages }}</span></p>
                <p>description: <span class="font-bold">{{ competition.description }}</span></p>
              </template>
            </Card>
          </TabPanel>

          <TabPanel value="1">
            <Message v-if="stageHint" severity="info" :closable="false" class="mb-4">
              {{ stageHint }}
            </Message>

            <Button
              v-if="canAddStage"
              @click.prevent="openCreateStage"
              :label="createStageLabel"
              icon="pi pi-plus"
            />
            <Message v-else severity="secondary" :closable="false">
              {{ stageLimitMessage }}
            </Message>

            <StagesView />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <div class="mt-6 flex gap-2 flex-wrap" v-if="competition">
        <div v-if="competition.timekeeper" class="flex items-center gap-4">
          <div>Timekeeper: {{ competition.timekeeper }}</div>
          <Button
            @click.prevent="removeTimekeeper"
            label="Remove Timekeeper"
            icon="pi pi-user-minus"
            severity="danger"
          />
        </div>
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

      <Dialog v-model:visible="visible" modal :header="createStageLabel" :style="{ width: '25rem' }">
        <template v-if="competitionType === COMPETITION_TYPE.QUALIFYING_FINAL">
          <div class="flex flex-col gap-2 mb-8">
            <label for="round" class="font-semibold">Round</label>
            <Select
              v-model="selectedRound"
              inputId="round"
              :options="missingRounds"
              optionLabel="name"
              optionValue="role"
              placeholder="Select round"
              class="w-full"
            />
          </div>
        </template>
        <template v-else>
          <div class="flex items-center gap-4 mb-4">
            <label for="stageNumber" class="font-semibold w-24">Stage number</label>
            <InputNumber v-model="stageData.number" id="stageNumber" class="flex-auto" autocomplete="off"/>
          </div>
          <div class="flex items-center gap-4 mb-8">
            <label for="stageName" class="font-semibold w-24">Name</label>
            <InputText v-model="stageData.name" id="stageName" class="flex-auto" autocomplete="off" />
          </div>
        </template>
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
import { ref, onMounted, reactive, computed } from 'vue';
import { useI18n } from 'vue-i18n'
import { useCompetitionsStore } from '@/stores/competitions.js'
import { useStagesStore } from '@/stores/stages.js'
import StagesView from '@/views/competitions/StagesView.vue'
import {
  COMPETITION_TYPE,
  competitionTypeLabel,
  getCompetitionType,
  getStageLimitMessage,
  getCreateStageLabel,
  missingQualifyingFinalStages,
  nextBestOfNStage,
  nextFreeStageNumber,
} from '@/constants/competitionTypes'

const route = useRoute()
const router = useRouter()
const { locale } = useI18n()
const competitionsStore = useCompetitionsStore()
const stagesStore = useStagesStore()
const confirm = useConfirm()
const toast = useToast()

const competition = ref(null)
const email = ref('')
const visible = ref(false)
const selectedRound = ref(null)
const stageData = reactive({
  number: 1,
  name: ''
})

const competitionType = computed(() => competition.value?.type || COMPETITION_TYPE.MULTI_STAGE)
const stageHint = computed(() => getCompetitionType(competition.value?.type, locale.value)?.stageHint || '')
const missingRounds = computed(() => missingQualifyingFinalStages(stagesStore.stages, locale.value))

const canAddStage = computed(() => {
  if (competitionType.value === COMPETITION_TYPE.SINGLE_RUN) {
    return stagesStore.stages.length === 0
  }
  if (competitionType.value === COMPETITION_TYPE.QUALIFYING_FINAL) {
    return missingRounds.value.length > 0
  }
  return true
})

const createStageLabel = computed(() => getCreateStageLabel(competitionType.value, locale.value))
const stageLimitMessage = computed(() => getStageLimitMessage(competitionType.value, locale.value))

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

const goToResults = () => {
  router.push({ name: 'competition-results', params: { id: route.params.id } })
}

const actions = ref([
  {
    label: 'Results',
    icon: 'pi pi-trophy',
    command: () => {
      goToResults()
    }
  },
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

const openCreateStage = async () => {
  const isEn = locale.value === 'en'
  if (competitionType.value === COMPETITION_TYPE.SINGLE_RUN) {
    await stagesStore.createStage(route.params.id, 1, isEn ? 'Run' : 'Заїзд', 'run')
    return
  }

  if (competitionType.value === COMPETITION_TYPE.BEST_OF_N) {
    const stage = nextBestOfNStage(stagesStore.stages, locale.value)
    await stagesStore.createStage(route.params.id, stage.number, stage.name, stage.role)
    const runsCount = Math.max(2, stagesStore.stages.length + 1)
    await competitionsStore.updateRunsCount(route.params.id, runsCount)
    if (competition.value) competition.value.runsCount = runsCount
    return
  }

  if (competitionType.value === COMPETITION_TYPE.QUALIFYING_FINAL) {
    if (missingRounds.value.length === 1) {
      const stage = missingRounds.value[0]
      await stagesStore.createStage(route.params.id, stage.number, stage.name, stage.role)
      return
    }
    selectedRound.value = missingRounds.value[0]?.role || null
    visible.value = true
    return
  }

  const numbers = stagesStore.stages.map((stage) => Number(stage.number) || 0)
  stageData.number = nextFreeStageNumber(stagesStore.stages, (numbers.length ? Math.max(...numbers) : 0) + 1)
  stageData.name = ''
  visible.value = true
}

const createStage = async () => {
  if (competitionType.value === COMPETITION_TYPE.QUALIFYING_FINAL) {
    const stage = missingRounds.value.find((round) => round.role === selectedRound.value)
    if (!stage) return
    visible.value = false
    await stagesStore.createStage(route.params.id, stage.number, stage.name, stage.role)
    return
  }

  if (!stageData.name) return
  visible.value = false
  await stagesStore.createStage(route.params.id, stageData.number, stageData.name, 'special')
}

const addTimekeeper = async () => {
  await competitionsStore.addTimekeeper(route.params.id, email.value)
  competition.value = await competitionsStore.getCompetitionById(route.params.id)
}

const removeTimekeeper = async () => {
  await competitionsStore.removeTimekeeper(route.params.id)
  competition.value = await competitionsStore.getCompetitionById(route.params.id)
}

</script>

<style scoped lang="scss">

</style>
