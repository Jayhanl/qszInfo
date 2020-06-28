<template>
  <div class="home"></div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'home',
  data() {
    return {}
  },
  methods: {
    // 获取openid
    getCode() {
      // if (
      //   sessionStorage.getItem("token") &&
      //   sessionStorage.getItem("token") != "undefined"
      // ) {
      //   return false;
      // }
      let code = this.getUrlParam('code') // 截取路径中的code，如果没有就去微信授权，如果已经获取到了就直接传code给后台获取openId
      let local = window.location.href
      let APPID = 'wxd6dceeee251fe0ad'
      if (code == null || code === '') {
        window.location.href =
          'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
          APPID +
          '&redirect_uri=' +
          encodeURIComponent(local) +
          '&response_type=code&scope=snsapi_base&state=#wechat_redirect'
      } else {
        this.getOpenId(code) //把code传给后台获取用户信息
      }
    },
    //把code传给后台,得到openid
    getOpenId(code) {
      axios
        .get('/api/login/wx_login', {
          params: {
            code: code
          }
        })
        .then(res => {
          // 本地存储这个openid，并刷新页面
          sessionStorage.setItem('token', res.data.token)
          sessionStorage.setItem(
            'contactMobile',
            res.data.userData.contactMobile
          )
          axios.defaults.headers.common.Authorization = res.data.token
          let url = window.location.href //获取当前页面的url
          if (url.indexOf('?') != -1) {
            //判断是否存在参数
            url = url.replace(/(\?|#)[^'"]*/, '') //去除参数
            window.history.pushState({}, 0, url)
          }
          if (sessionStorage.getItem('url')) {
            this.$router.replace({
              name: sessionStorage.getItem('url')
            })
            sessionStorage.removeItem('url')
          } else if (res.data.userData.contactMobile) {
            if (sessionStorage.getItem('jump')) {
              this.$router.replace({
                name: sessionStorage.getItem('jump')
              })
              sessionStorage.removeItem('jump')
              return
            }
            this.$router.replace({
              name: 'service'
            })
          } else {
            this.$router.replace({
              name: 'register'
            })
          }
        })
    },
    //获取地址栏的参数
    getUrlParam(name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
      var r = window.location.search.substr(1).match(reg)
      if (r != null) return unescape(r[2])
      return null
    }
  },
  created() {
    this.getCode()
  }
}
</script>

<style scoped>
</style>
