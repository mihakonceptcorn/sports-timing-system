<template>
  <div class="bg-surface-50 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20">
    <div class="bg-surface-0 dark:bg-surface-900 p-6 shadow rounded-border w-full lg:w-6/12 mx-auto">
      <div class="text-center mb-8">
        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">{{ formTitle }}</div>
        <span
          class="text-surface-600 dark:text-surface-200 font-medium leading-normal"
        >
          {{ formDescription }}
        </span>
        <a
          @click.prevent="register = !register"
          class="font-medium no-underline ml-2 text-primary cursor-pointer"
        >
          {{ formAction }}
        </a>
      </div>

      <div>
        <label for="email1" class="text-surface-900 dark:text-surface-0 font-medium mb-2 block">Email</label>
        <InputText
          v-model="credentials.email"
          id="email1"
          type="text"
          placeholder="Email address"
          class="w-full mb-4"
        />

        <label for="password1" class="text-surface-900 dark:text-surface-0 font-medium mb-2 block">Password</label>
        <InputText
          v-model="credentials.password"
          id="password1"
          type="password"
          placehoder="Password"
          class="w-full mb-4"
        />

        <Button
          @click="onSubmit"
          :label="formButton"
          icon="pi pi-user !text-xl !leading-none"
          class="w-full"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { useAuthStore } from '@/stores/auth.js';

const authStore = useAuthStore()

const register = ref(false)

const formTitle = computed(() => {
  return register.value ? 'Register' : 'Welcome Back'
})

const formDescription = computed(() => {
  return register.value ? '' : 'Don\'t have an account?'
})

const formAction = computed(() => {
  return register.value ? 'Go to login!' : 'Create today!'
})

const formButton = computed(() => {
  return register.value ? 'Sign Up' : 'Sign In'
})

const credentials = reactive({
  email: '',
  password: ''
})

const onSubmit = () => {
  if (!credentials.email || !credentials.password) {
    alert('No empty fields!')
  }
  else {
    if (register.value) {
      authStore.registerUser(credentials)
    }
    else {
      authStore.loginUser(credentials)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
