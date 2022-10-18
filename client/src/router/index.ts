import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/roles',
      name: 'roles',
      component: () => import('../views/RolesView.vue')
    },
    {
      path: '/positions',
      name: 'positions',
      component: () => import('../views/PositionsView.vue')
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/UsersView.vue')
    },
    {
      path: '/tests',
      name: 'tests',
      component: () => import('../views/TestsView.vue')
    },
    {
      path: '/user/tests',
      name: 'user_tests',
      component: () => import('../views/UserTestsView.vue')
    },
    {
      path: '/user/testing',
      name: 'user_testing',
      component: () => import('../views/UserTestingView.vue')
    }
  ]
})

export default router
