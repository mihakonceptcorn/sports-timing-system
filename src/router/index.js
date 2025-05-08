import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AuthView from '@/views/AuthView.vue'
import AccountView from '@/views/AccountView.vue'
import DashboardView from '@/views/DashboardView.vue'
import CompetitionsView from '@/views/competitions/CompetitionsView.vue'
import CreateCompetitionView from '@/views/competitions/CreateCompetitionView.vue'
import PreviewCompetitionView from '@/views/competitions/PreviewCompetitionView.vue'
import AddCompetitorView from '@/views/competitions/AddCompetitorView.vue'
import TimekeepingView from '@/views/competitions/TimekeepingView.vue'
import TimekeepingCompetitionView from '@/views/competitions/TimekeepingCompetitionView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
          path: 'competition/:id/add-competitor',
          name: 'add-competitor',
          component: AddCompetitorView
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

export default router
