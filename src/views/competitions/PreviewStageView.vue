<template>
  <Card v-if="stage">
    <template #title>
      <span>{{ stage.name }}</span>
    </template>
    <template #content>
      <div class="flex justify-between flex-wrap gap-2">
        <div class="flex items-center gap-2 flex-wrap">
          <Button
            @click.prevent="$router.push({name: 'started', params: {id: $route.params.id, stageId: stage.id}})"
            label="Start stage"
            icon="pi pi-play"
            severity="danger"
          />
          <Button
            @click.prevent="goToResults"
            label="Переглянути результати"
            icon="pi pi-trophy"
            severity="success"
          />
        </div>

        <Button
          @click.prevent="$router.push({name: 'competition-preview', params: { id: $route.params.id } })"
          label="Go back"
          icon="pi pi-arrow-left"
          class=""
          severity="warn"
        />
      </div>

      <Message v-if="isLastStage" severity="info" :closable="false" class="mt-4 mb-2">
        Це останній етап змагання. Після завершення заїздів натисніть «Переглянути результати» для перегляду підсумкової таблиці.
      </Message>

      <CompetitorsView />

      <div class="flex items-center gap-2 mt-6 flex-wrap">
        <Button
          @click.prevent="visible = true"
          label="Add competitor"
          icon="pi pi-user-plus"
        />
        <Button
          v-if="otherStages.length"
          @click.prevent="openCopyDialog"
          label="Копіювати учасників з іншого етапу"
          icon="pi pi-copy"
          severity="secondary"
          outlined
        />
      </div>

      <Dialog v-model:visible="copyDialogVisible" modal header="Копіювати учасників" :style="{ width: '25rem' }">
        <p class="text-sm text-gray-600 mb-4">
          Оберіть етап, з якого скопіювати список учасників (без часу заїздів) до цього етапу:
        </p>
        <div class="flex flex-col gap-1 mb-6">
          <label class="font-semibold text-sm">З етапу:</label>
          <Select
            v-model="selectedSourceStageId"
            :options="otherStages"
            optionLabel="name"
            optionValue="id"
            placeholder="Оберіть етап"
            class="w-full"
          />
        </div>
        <div class="flex justify-end gap-2">
          <Button type="button" label="Скасувати" severity="secondary" @click="copyDialogVisible = false" />
          <Button type="button" label="Скопіювати" :loading="isCopying" @click="confirmCopyCompetitors" />
        </div>
      </Dialog>

      <Dialog v-model:visible="visible" modal header="Add competitor" :style="{ width: '25rem' }">
        <div class="flex flex-col gap-0.5">
          <label for="name">Name</label>
          <InputText v-model="formData.name" id="name" placeholder="Name" />
        </div>

        <div class="flex flex-col gap-0.5 mt-2">
          <label for="secondName">Second Name</label>
          <InputText v-model="formData.secondName" id="secondName" placeholder="Second Name" />
        </div>

        <div class="flex flex-col gap-0.5 mt-2">
          <label for="gender">Gender</label>
          <Select
            v-model="formData.gender"
            :options="genders"
            placeholder="Select gender"
            class="w-full"
          />
        </div>

        <div class="flex flex-col gap-0.5 mt-2">
          <label for="category">Category</label>
          <Select
            v-model="formData.category"
            :options="categories"
            placeholder="Select category"
            class="w-full"
          />
        </div>

        <div class="flex flex-col gap-0.5 mt-2">
          <label for="category">DOB</label>
          <InputText v-model="formData.dob" id="dob" placeholder="DOB" />
        </div>

        <div class="flex flex-col gap-0.5 mt-2">
          <label for="team">Team</label>
          <InputText v-model="formData.team" id="team" placeholder="Team" />
        </div>

        <div class="flex flex-col gap-0.5 mt-2">
          <label for="region">Address</label>
          <InputText v-model="formData.address" id="region" placeholder="Address" />
        </div>

        <div class="flex flex-col gap-0.5 mt-2">
          <label for="competitorNumber">Competitor Number</label>
          <InputNumber v-model="formData.competitorNumber" id="competitorNumber" placeholder="Competitor Number" />
        </div>

        <div class="flex justify-end gap-2 mt-4">
          <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
          <Button type="button" label="Create" @click="addCompetitor"></Button>
        </div>
      </Dialog>

      <Toast position="bottom-right"/>
    </template>
  </Card>
</template>

<script setup>
import { useStagesStore } from '@/stores/stages.js'
import { useCompetitorsStore } from '@/stores/competitors.js'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, reactive, ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast'
import CompetitorsView from '@/views/competitions/CompetitorsView.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const stagesStore = useStagesStore()
const competitorsStore = useCompetitorsStore()

const stage = ref()
const visible = ref(false)
const copyDialogVisible = ref(false)
const selectedSourceStageId = ref(null)
const isCopying = ref(false)
const categories = ref(['amateurs', 'masters', 'elite', 'juniors'])
const genders = ref(['Male', 'Female'])

const otherStages = computed(() => {
  return stagesStore.stages.filter((s) => s.id !== route.params.stageId)
})

const isLastStage = computed(() => {
  const sorted = [...stagesStore.stages].sort((a, b) => (Number(a.number) || 0) - (Number(b.number) || 0))
  if (sorted.length === 0) return false
  const last = sorted[sorted.length - 1]
  return last.id === route.params.stageId
})

const formData = reactive({
  competitionId: route.params.id,
  stageId: route.params.stageId,
  name: null,
  secondName: null,
  gender: null,
  category: null,
  dob: null,
  team: null,
  address: null,
  competitorNumber: null,
})

const goToResults = () => {
  router.push({ name: 'competition-results', params: { id: route.params.id } })
}

const openCopyDialog = () => {
  if (otherStages.value.length) {
    selectedSourceStageId.value = otherStages.value[0].id
    copyDialogVisible.value = true
  }
}

const confirmCopyCompetitors = async () => {
  if (!selectedSourceStageId.value) return
  isCopying.value = true
  try {
    const count = await competitorsStore.copyCompetitorsFromStage(
      selectedSourceStageId.value,
      route.params.stageId,
      route.params.id
    )
    copyDialogVisible.value = false
    toast.add({
      severity: 'success',
      summary: 'Успішно',
      detail: `Скопійовано ${count} учасників`,
      life: 3000,
    })
  } catch (error) {
    console.error('Error copying competitors:', error)
    toast.add({
      severity: 'error',
      summary: 'Помилка',
      detail: 'Не вдалося скопіювати учасників',
      life: 3000,
    })
  } finally {
    isCopying.value = false
  }
}

const addCompetitor = async () => {
  await competitorsStore.addCompetitor(formData)

  visible.value = false

  formData.name = null
  formData.secondName = null
  formData.gender = null
  formData.category = null
  formData.dob = null
  formData.team = null
  formData.address = null
  formData.competitorNumber = null
}

onMounted(async () => {
  stage.value = await stagesStore.getStageById(route.params.stageId)
  await stagesStore.getStages(route.params.id)
  await competitorsStore.getCompetitors(route.params.stageId)
})
</script>


<style scoped lang="scss">

</style>
