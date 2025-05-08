<template>
  <div class="add-competitor w-full">
    <h3 class="text-2xl">Add Competitor</h3>

    <div class="flex flex-col gap-0.5 mt-4">
      <label for="name">Name</label>
      <InputText v-model="formData.name" id="name" placeholder="Name" />
    </div>

    <div class="flex flex-col gap-0.5 mt-4">
      <label for="secondName">Second Name</label>
      <InputText v-model="formData.secondName" id="secondName" placeholder="Second Name" />
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

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
  competitionNumber: null,
})
</script>

<style scoped lang="scss">

</style>
