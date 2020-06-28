// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueClipboard from 'vue-clipboard2'
import '@/assets/js/axios'
import '@/assets/js//vant'

Vue.use(VueClipboard)
Vue.config.productionTip = false
VueClipboard.config.autoSetContainer = true

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
