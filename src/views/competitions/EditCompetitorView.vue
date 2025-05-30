<template>
  <Card v-if="competitor" class="relative">
    <template #title>Edit Competitor</template>
    <template #content>
      <div class="flex flex-col gap-0.5">
        <label for="name">Id</label>
        <InputText v-model="competitor.id" id="name" placeholder="id" disabled />
      </div>

      <div class="flex flex-col gap-0.5 mt-2">
        <label for="name">Name</label>
        <InputText v-model="competitor.name" id="name" placeholder="Name" />
      </div>

      <div class="flex flex-col gap-0.5 mt-2">
        <label for="secondName">Second Name</label>
        <InputText v-model="competitor.secondName" id="secondName" placeholder="Second Name" />
      </div>

      <div class="flex flex-col gap-0.5 mt-2">
        <label for="gender">Gender</label>
        <Select
          v-model="competitor.gender"
          :options="genders"
          placeholder="Select gender"
          class="w-full"
        />
      </div>

      <div class="flex flex-col gap-0.5 mt-2">
        <label for="category">Category</label>
        <Select
          v-model="competitor.category"
          :options="categories"
          placeholder="Select category"
          class="w-full"
        />
      </div>

      <div class="flex flex-col gap-0.5 mt-2">
        <label for="category">DOB</label>
        <InputText v-model="competitor.dob" id="dob" placeholder="DOB" />
      </div>

      <div class="flex flex-col gap-0.5 mt-2">
        <label for="team">Team</label>
        <InputText v-model="competitor.team" id="team" placeholder="Team" />
      </div>

      <div class="flex flex-col gap-0.5 mt-2">
        <label for="region">Address</label>
        <InputText v-model="competitor.address" id="region" placeholder="Address" />
      </div>

      <div class="flex flex-col gap-0.5 mt-2">
        <label for="competitorNumber">Competitor Number</label>
        <InputNumber v-model="competitor.competitorNumber" id="competitorNumber" placeholder="Competitor Number" />
      </div>

      <div class="gap-2 mt-4">
        <Button label="Update" icon="pi pi-refresh" @click.prevent="update"/>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCompetitorsStore } from '@/stores/competitors.js';

const route = useRoute()
const router = useRouter()
const competitorsStore = useCompetitorsStore()

const categories = ref(['amateurs', 'masters', 'elite', 'juniors'])
const genders = ref(['Male', 'Female'])

const competitor = ref(null)

const update = async () => {
  await competitorsStore.updateCompetitor(competitor.value)
  await router.push({ name: 'stage-preview', params: { id: route.params.stageId } })
}

onMounted(async () => {
  competitor.value = await competitorsStore.getCompetitorById(route.params.competitorId)
})
</script>

<style scoped lang="scss">

</style>
