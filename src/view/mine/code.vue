<template>
  <div>
    <navbar title="我的邀请码" />
    <div class="mine_code">
      <!-- <img class="img" @touchstart="start" :src="codeImg" /> -->
      <van-image class="img" width="200" height="200" :src="codeImg" />
      <span>邀请码</span>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import navbar from '@/components/navbar.vue'
export default {
  name: 'code',
  components: {
    navbar
  },
  data() {
    return {
      codeImg: '',
      longClick:0,
      timeOutEvent:0
    }
  },
  methods: {
    getData() {
      axios.get('/api/user/get_invitation_code').then(res => {
        this.codeImg = res.data.url
      })
    },
  },
  created() {
    if (!sessionStorage.getItem('token')) {
      this.$router.replace({
        name: 'index'
      })
      return
    }
    this.getData()
    document.title = '市井&轻家政'
  }
}
</script>

<style scoped lang="less">
.mine_code {
  min-height: calc(100vh - 46px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 22px;
  .img {
    width: 200px;
    height: 200px;
    margin-top: -46px;
    margin-bottom: 10px;
  }
}
</style>
