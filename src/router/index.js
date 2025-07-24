import { createRouter, createWebHashHistory, RouterView } from 'vue-router'
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
import EditCompetitionView from '@/views/competitions/EditCompetitionView.vue'
import EditStageView from '@/views/competitions/EditStageView.vue'
import EditCompetitorView from '@/views/competitions/EditCompetitorView.vue'
import Tr from "@/i18n/translation"

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/:locale?",
      component: RouterView,
      beforeEnter: Tr.routeMiddleware,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
        },
        {
          path: 'auth',
          name: 'auth',
          component: AuthView,
        },
        {
          path: 'account',
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
              path: 'competition/:id/edit',
              name: 'competition-edit',
              component: EditCompetitionView
            },
            {
              path: 'competition/:id/:stageId',
              name: 'stage-preview',
              component: PreviewStageView
            },
            {
              path: 'competition/:id/:stageId/edit',
              name: 'stage-edit',
              component: EditStageView
            },
            {
              path: 'competition/:id/:stageId/:competitorId',
              name: 'competitor-edit',
              component: EditCompetitorView
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
      ]
    }
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
