import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/view/home.vue')
    },
    {
      path: '/form',
      name: 'form',
      component: () => import('@/view/form.vue')
    },
    {
      path: '/demand',
      name: 'demand',
      component: () => import('@/view/demand.vue')
    }
  ]
})
