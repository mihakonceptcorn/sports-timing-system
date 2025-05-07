import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AuthView from '@/views/AuthView.vue'
import AccountView from '@/views/AccountView.vue'
import DashboardView from '@/views/DashboardView.vue'
import CompetitionsView from '@/views/competitions/CompetitionsView.vue'
import CreateCompetitionView from '@/views/competitions/CreateCompetitionView.vue'
import PreviewCompetitionView from '@/views/competitions/PreviewCompetitionView.vue'

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
          path: 'competition-create',
          name: 'competition-create',
          component: CreateCompetitionView
        },
        {
          path: 'competition-preview/:id',
          name: 'competition-preview',
          component: PreviewCompetitionView
        }
      ]
    },
  ],
})

export default router
