<template>
  <Card v-if="stage">
    <template #title>
      <span>{{ stage.name }}</span>
    </template>
    <template #content>
      <div class="flex justify-between">
        <Button
          @click.prevent="$router.push({name: 'started', params: {id: $route.params.id, stageId: stage.id}})"
          label="Start stage"
          icon="pi pi-play"
          severity="danger"
        />

        <Button
          @click.prevent="$router.push({name: 'competition-preview', params: { id: $route.params.id } })"
          label="Go back"
          icon="pi pi-arrow-left"
          class="mr-6"
          severity="warn"
        />
      </div>

      <CompetitorsView />

      <Button
        @click.prevent="visible = true"
        label="Add competitor"
        icon="pi pi-user-plus"
        class="mt-6"
      />

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
    </template>
  </Card>
</template>

<script setup>
import { useStagesStore } from '@/stores/stages.js'
import { useCompetitorsStore } from '@/stores/competitors.js'
import { useRoute } from 'vue-router'
import { onMounted, reactive, ref } from 'vue';
import CompetitorsView from '@/views/competitions/CompetitorsView.vue'

const route = useRoute()
const stagesStore = useStagesStore()
const competitorsStore = useCompetitorsStore()

const stage = ref()
const visible = ref(false)
const categories = ref(['amateurs', 'masters', 'elite', 'juniors'])
const genders = ref(['Male', 'Female'])

const formData = reactive({
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
  await competitorsStore.getCompetitors(route.params.stageId)
})
</script>


<style scoped lang="scss">

</style>
