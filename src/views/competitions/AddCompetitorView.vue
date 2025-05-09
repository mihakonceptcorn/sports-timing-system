<template>
  <div class="add-competitor w-full mb-14">
    <div class="flex justify-end">
      <Button
        @click.prevent="$router.go(-1)"
        label="Go Back"
        icon="pi pi-arrow-left"
        class="mr-6"
      />
    </div>

    <h3 class="text-2xl">Add Competitor</h3>

    <div class="flex flex-col gap-0.5 mt-4">
      <label for="name">Name</label>
      <InputText v-model="formData.name" id="name" placeholder="Name" />
    </div>

    <div class="flex flex-col gap-0.5 mt-2">
      <label for="secondName">Second Name</label>
      <InputText v-model="formData.secondName" id="secondName" placeholder="Second Name" />
    </div>

    <div class="flex flex-col gap-0.5 mt-2">
      <label for="gender">Gender</label>
      <InputText v-model="formData.gender" id="gender" placeholder="Gender" />
    </div>

    <div class="flex flex-col gap-0.5 mt-2">
      <label for="category">Category</label>
      <InputText v-model="formData.category" id="category" placeholder="Category" />
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
      <label for="country">Country</label>
      <InputText v-model="formData.country" id="country" placeholder="Country" />
    </div>

    <div class="flex flex-col gap-0.5 mt-2">
      <label for="region">Region</label>
      <InputText v-model="formData.region" id="region" placeholder="Region" />
    </div>

    <div class="flex flex-col gap-0.5 mt-2">
      <label for="locality">Locality</label>
      <InputText v-model="formData.locality" id="locality" placeholder="Locality" />
    </div>

    <div class="flex flex-col gap-0.5 mt-2">
      <label for="competitorNumber">Competitor Number</label>
      <InputText v-model="formData.competitorNumber" id="competitorNumber" placeholder="Competitor Number" />
    </div>

    <div class="gap-2 mt-4">
      <Button label="Add" icon="pi pi-check-square" @click.prevent="addCompetitor"/>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { useCompetitorsStore } from '@/stores/competitors.js';

const competitorsStore = useCompetitorsStore()

const route = useRoute()
const router = useRouter()

const formData = reactive({
  competitionId: route.params.id,
  name: null,
  secondName: null,
  gender: null,
  category: null,
  dob: null,
  team: null,
  country: null,
  region: null,
  locality: null,
  competitorNumber: null,
})

const addCompetitor = async () => {
  await competitorsStore.addCompetitor(formData)
  await router.push({name: 'competition-preview', params: { id: route.params.id }})
}
</script>

<style scoped lang="scss">

</style>
