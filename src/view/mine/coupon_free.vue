<template>
  <div>
    <navbar title="领取优惠券" />
    <div class="mine_code"></div>
  </div>
</template>

<script>
import axios from 'axios'
import navbar from '@/components/navbar.vue'
export default {
  name: 'coupon_free',
  components: {
    navbar,
  },
  data() {
    return {}
  },
  methods: {
    getData() {
      axios
        .post('/api/user/activity')
        .then((res) => {
          if (res.data.isAward) {
            this.$dialog
              .alert({
                title: '领取成功',
                message:
                  '恭喜您获得1元2小时的保洁优惠券一张，快去我的优惠券页面使用吧~',
              })
              .then(() => {
                this.$router.replace({
                  name: 'coupon',
                })
              })
          } else {
            this.$dialog
              .alert({
                title: '领取通知',
                message: '手慢了,优惠券已领完',
              })
              .then(() => {
                this.$router.replace({
                  name: 'service',
                })
              })
          }
        })
        .catch(() => {
          this.$router
            .replace({
              name: 'service',
            })
            .then(() => {
              this.$toast('您已经领过了')
            })
        })
    },
  },
  created() {
    if (!sessionStorage.getItem('token')) {
      sessionStorage.setItem('jump', 'coupon_free')
      this.$router.replace({
        name: 'index',
      })
      return
    }
    this.getData()
    document.title = '市井&轻松装'
  },
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
