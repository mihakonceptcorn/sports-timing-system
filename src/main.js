import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Ripple from 'primevue/ripple'
import Aura from '@primevue/themes/aura'

import App from './App.vue'
import router from './router'

import '@/assets/styles.css'

const app = createApp(App)

app.directive('ripple', Ripple)

const pinia = createPinia()
pinia.use(({ store }) => {
  store.router = markRaw(router)
})

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: '.my-app-dark',
      cssLayer: false
    }
  },
  ripple: true
});
app.use(pinia)
app.use(router)

app.mount('#app')
