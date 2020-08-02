import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'index',
    component: () => import('@/view/index.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/view/register/register.vue')
  },
  {
    path: '/demand',
    name: 'demand',
    component: () => import('@/view/steward/demand.vue')
  },
  {
    path: '/service',
    name: 'service',
    component: () => import('@/view/service/service.vue')
  },
  {
    path: '/mine',
    name: 'mine',
    component: () => import('@/view/mine/mine.vue')
  },
  {
    path: '/code',
    name: 'code',
    component: () => import('@/view/mine/code.vue')
  },
  {
    path: '/sign',
    name: 'sign',
    component: () => import('@/view/mine/sign.vue')
  },
  {
    path: '/order',
    name: 'order',
    component: () => import('@/view/mine/order.vue')
  },
  {
    path: '/order_detail',
    name: 'order_detail',
    component: () => import('@/view/mine/order_detail.vue')
  },
  {
    path: '/coupon',
    name: 'coupon',
    component: () => import('@/view/mine/coupon.vue')
  },
  {
    path: '/coupon_free',
    name: 'coupon_free',
    component: () => import('@/view/mine/coupon_free.vue')
  },
  {
    path: '/addr_list',
    name: 'addr_list',
    component: () => import('@/view/mine/addr_list.vue')
  },
  {
    path: '/addr_add',
    name: 'addr_add',
    component: () => import('@/view/mine/addr_add.vue')
  },
  {
    path: '/addr_edit',
    name: 'addr_edit',
    component: () => import('@/view/mine/addr_edit.vue')
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
  }
  ]
})
