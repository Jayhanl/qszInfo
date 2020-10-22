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
    path: '/shop',
    name: 'shop',
    component: () => import('@/view/shop/shop.vue')
  },
  {
    path: '/company_clean',
    name: 'company_clean',
    component: () => import('@/view/company/clean.vue')
  },
  {
    path: '/service',
    name: 'service',
    component: () => import('@/view/service/service.vue')
  },
  {
    path: '/nurse',
    name: 'nurse',
    component: () => import('@/view/nurse/nurse.vue')
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
    path: '/scan',
    name: 'scan',
    component: () => import('@/view/mine/scan.vue')
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
    path: '/mask_order',
    name: 'mask_order',
    component: () => import('@/view/mine/mask_order.vue')
  },
  {
    path: '/mask_detail',
    name: 'mask_detail',
    component: () => import('@/view/mine/mask_detail.vue')
  },
  {
    path: '/coupon_order',
    name: 'coupon_order',
    component: () => import('@/view/mine/coupon_order.vue')
  },
  {
    path: '/company_clean_order',
    name: 'company_clean_order',
    component: () => import('@/view/mine/company_clean_order.vue')
  },
  {
    path: '/company_clean_detail',
    name: 'company_clean_detail',
    component: () => import('@/view/mine/company_clean_detail.vue')
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
    component: () => import('@/view/functional/agreement_user.vue')
  },
  {
    path: '/agreement_qsz',
    name: 'agreement_qsz',
    component: () => import('@/view/functional/agreement_qsz.vue')
  },
  {
    path: '/contect',
    name: 'contect',
    component: () => import('@/view/functional/contect.vue')
  }
  ]
})
