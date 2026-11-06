<template>
  <Card>
    <template #title>Create Competition</template>
    <template #content>
      <div class="flex flex-col gap-0.5 mt-4">
        <label for="compname">Competition Name</label>
        <InputText v-model="formData.name" id="compname" placeholder="Competition Name" aria-describedby="username-help" />
      </div>

      <div class="flex flex-col gap-0.5 mt-2">
        <label for="date">Date</label>
        <DatePicker placeholder="Date" id="date" v-model="formData.date"/>
      </div>

      <div class="flex flex-col gap-0.5 mt-2">
        <label for="country">Country</label>
        <InputText placeholder="Country" id="country" type="text" v-model="formData.country"/>
      </div>

      <div class="flex flex-col gap-0.5 mt-2">
        <label for="city">City</label>
        <InputText placeholder="City" id="city" type="text" v-model="formData.city"/>
      </div>

      <div class="flex flex-col gap-0.5 mt-2">
        <label for="location">Location</label>
        <InputText placeholder="Location" id="location" type="text" v-model="formData.location"/>
      </div>

      <div class="flex flex-col gap-0.5 mt-2">
        <label for="description">Description</label>
        <TextArea placeholder="Description" id="description" type="text" v-model="formData.description"/>
      </div>

      <CompetitionTypeField v-model:type="formData.type" v-model:runsCount="formData.runsCount" />

      <Message v-if="error" severity="error" :closable="false" class="mt-4">{{ error }}</Message>

      <div class="gap-2 mt-4">
        <Button label="Create" icon="pi pi-check-square" @click.prevent="create"/>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useCompetitionsStore } from '@/stores/competitions.js'
import { useRouter } from 'vue-router';
import CompetitionTypeField from '@/components/competitions/CompetitionTypeField.vue'
import { COMPETITION_TYPE } from '@/constants/competitionTypes'

const competitionsStore = useCompetitionsStore()
const router = useRouter()
const error = ref('')

const formData = reactive({
  name: null,
  date: null,
  country: null,
  city: null,
  location: null,
  description: null,
  type: null,
  runsCount: 2,
})

const create = async () => {
  if (!formData.type) {
    error.value = 'Select a competition type.'
    return
  }

  if (formData.type === COMPETITION_TYPE.BEST_OF_N && (!formData.runsCount || formData.runsCount < 2)) {
    error.value = 'Best of N needs at least 2 runs.'
    return
  }

  error.value = ''
  await competitionsStore.createCompetition(formData)
  await router.push({name: 'competitions'})
}

</script>

<style scoped lang="scss">

</style>
