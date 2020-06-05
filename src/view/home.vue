<template>
  <div class="home">
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: "home",
  data() {
    return {};
  },
  methods: {
    // 获取openid
    getCode() {
      if (
        sessionStorage.getItem("openid") &&
        sessionStorage.getItem("openid") != "undefined"
      ) {
        return false;
      }
      let code = this.getUrlParam("code"); // 截取路径中的code，如果没有就去微信授权，如果已经获取到了就直接传code给后台获取openId
      let local = window.location.href;
      let APPID = "wx5adf34709292134d";
      if (code == null || code === "") {
        window.location.href =
          "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
          APPID +
          "&redirect_uri=" +
          encodeURIComponent(local) +
          "&response_type=code&scope=snsapi_base&state=#wechat_redirect";
      } else {
        this.getOpenId(code); //把code传给后台获取用户信息
      }
    },
    //把code传给后台,得到openid
    getOpenId(code) {
      axios
        .get("/login/wx_login", {
          params: {
            code: code
          }
        })
        .then(res => {
          // 本地存储这个openid，并刷新页面
          sessionStorage.setItem("token", res.data.token);
          axios.defaults.headers.common.Authorization = res.data.token
          if(res.data.userData.vipLevel===1){
            this.$router.replace({
              name:'demand'
            })
          }else{
            this.$router.replace({
              name:'form'
            })
          }
        })
    },
    //获取地址栏的参数
    getUrlParam(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    }
  },
  created() {
    this.getCode();
  }
};
</script>

<style scoped>
</style>
