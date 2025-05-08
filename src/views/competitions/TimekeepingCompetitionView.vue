<template>
  <div
    :class="{'full': isFullscreen}"
    class="timekeepingCompetition w-full"
    ref="fullscreen"
  >
    <h3 class="text-3xl" >Timekeeping</h3>
    <Button label="Full screen" @click.prevent="toggleFullScreen"/>
    <div>
      Comp ---- {{ $route.params.id }}
    </div>
  </div>
</template>

<script setup>
import {useTemplateRef} from 'vue';
import {useFullscreen} from '@vueuse/core';

const el = useTemplateRef('fullscreen')
const { isFullscreen, enter, exit, toggle } = useFullscreen(el)

const toggleFullScreen = () => {
  toggle()
}
</script>

<style scoped lang="scss">
.full {
  background-color: white;
  padding: 20px;
}
</style>
