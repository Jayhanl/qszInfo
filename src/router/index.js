import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [{
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
    },
    {
      path: '/agreement_user',
      name: 'agreement_user',
      component: () => import('@/view/agreement_user.vue')
    },
    {
      path: '/agreement_qsz',
      name: 'agreement_qsz',
      component: () => import('@/view/agreement_qsz.vue')
    },
    {
      path: '/ordering',
      name: 'ordering',
      component: () => import('@/view/ordering.vue')
    }
  ]
})
