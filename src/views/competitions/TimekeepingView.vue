<template>
  <div
    class="timekeeping w-full"
  >
    <h3 class="text-3xl" >Timekeeping</h3>
    <Listbox
      @change="goToCompetition"
      v-model="selectedCompetition"
      :options="competitionsStore.timeKeepingCompetitions"
      optionLabel="name"
      class="w-full md:w-56 mt-6"
    />
  </div>
</template>

<script setup>
import { useCompetitionsStore } from '@/stores/competitions.js'
import { ref } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter()

const competitionsStore = useCompetitionsStore()

const selectedCompetition = ref()

const goToCompetition = () => {
  router.push({name: 'timekeeping-competition', params: { id: selectedCompetition.value.id }})
}
</script>

<style scoped lang="scss">

</style>
