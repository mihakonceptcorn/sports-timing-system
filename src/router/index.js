import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore} from '@/stores/auth.js'
import HomeView from '@/views/HomeView.vue'
import AuthView from '@/views/AuthView.vue'
import AccountView from '@/views/AccountView.vue'
import DashboardView from '@/views/DashboardView.vue'
import CompetitionsView from '@/views/competitions/CompetitionsView.vue'
import CreateCompetitionView from '@/views/competitions/CreateCompetitionView.vue'
import PreviewCompetitionView from '@/views/competitions/PreviewCompetitionView.vue'
import TimekeepingView from '@/views/competitions/TimekeepingView.vue'
import TimekeepingCompetitionView from '@/views/competitions/TimekeepingCompetitionView.vue'
import StartedCompetitionView from '@/views/competitions/StartedCompetitionView.vue'
import PreviewStageView from '@/views/competitions/PreviewStageView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthView,
    },
    {
      path: '/account',
      name: 'account',
      component: AccountView,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: DashboardView
        },
        {
          path: 'competitions',
          name: 'competitions',
          component: CompetitionsView
        },
        {
          path: 'competition/create',
          name: 'competition-create',
          component: CreateCompetitionView
        },
        {
          path: 'competition/:id',
          name: 'competition-preview',
          component: PreviewCompetitionView
        },
        {
          path: 'competition/:id/:stageId',
          name: 'stage-preview',
          component: PreviewStageView
        },
        {
          path: 'competition/:id/:stageId/started',
          name: 'started',
          component: StartedCompetitionView
        },
        {
          path: 'timekeeping',
          name: 'timekeeping',
          component: TimekeepingView
        },
        {
          path: 'timekeeping/:id',
          name: 'timekeeping-competition',
          component: TimekeepingCompetitionView
        },
      ]
    },
  ],
})

// router.beforeEach(async (to, from) => {
//   const authStore = useAuthStore()
//
//   if (!authStore.user.id && !['home', 'auth'].includes(to.name)) {
//     return { name: 'home' }
//   }
//
//   if (authStore.user.id && to.name === 'auth') {
//     return false
//   }
// })

export default router
