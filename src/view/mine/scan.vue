<template>
  <div>
    <navbar title="扫码送礼" />
    <div class="mine_sign">
      <div class="text">现有次数：</div>
      <div class="num">{{ qrCodeNum }}</div>
      <!-- <button :class="['btn', 'active']" @click="onSign">
        <span>10</span>
      </button> -->
      <div class="instructions">
        <p class="title">
          <img
            src="https://qjz.oss-cn-shenzhen.aliyuncs.com/images/sign.png"
            alt
          />
          扫码说明：
        </p>
        <p>1、每张二维码仅能扫码1次，每扫1张二维码累计1次；</p>
        <p>2、累积扫码10次送一小时上门保洁优惠券！</p>
        <p>3、赠送优惠券后扫码次数清零。</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import navbar from '@/components/navbar.vue'
export default {
  name: 'code',
  components: {
    navbar,
  },
  data() {
    return {
      qrCodeNum: 0,
    }
  },
  methods: {
    getData() {
      axios.get('/api/user/get').then((res) => {
        this.qrCodeNum = res.data.qrCodeNum
      })
    },
    onQr() {
      axios
        .post('/api/user/qr_code', {
          cdk: sessionStorage.getItem('cdk'),
        })
        .then((res) => {
          sessionStorage.removeItem('cdk')
          let that = this
          that.qrCodeNum++
          if (that.qrCodeNum === 10) {
            that.$dialog
              .confirm({
                title: '扫码成功',
                message: `累计扫码10次，已送您优惠券一张，是否前往查看`,
              })
              .then(() => {
                that.$router.push({ name: 'coupon' })
              })
            that.qrCodeNum = 0
          } else {
            that.$dialog.confirm({
              title: '兑换成功',
              message: `已成功累加次数~`,
            })
          }
        })
        .catch(() => {
          sessionStorage.removeItem('cdk')
          this.$dialog.confirm({
            title: '兑换失败',
            message: `该二维码已经被扫了`,
          })
        })
    },
    //获取地址栏的参数
    getUrlParam(name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
      var r = window.location.search.substr(1).match(reg)
      if (r != null) return unescape(r[2])
      return null
    },
  },
  created() {
    if (this.$route.query.cdk) {
      sessionStorage.setItem('cdk', this.$route.query.cdk)
    }
    if (!sessionStorage.getItem('token')) {
      sessionStorage.setItem('jump', 'scan')
      this.$router.replace({
        name: 'index',
      })
      return
    } else {
      this.getData()
      console.log(sessionStorage.getItem('cdk'))
      if (sessionStorage.getItem('cdk')) this.onQr()
      document.title = '市井&轻家政'
    }
  },
}
</script>

<style scoped lang="less">
.mine_sign {
  min-height: calc(100vh - 46px);
  background-image: url('../../assets/images/bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 22px;
  .text {
    width: 70%;
    margin-left: 50px;
    font-size: 16px;
  }
  .num {
    margin-top: 20px;
    font-size: 50px;
    font-weight: bold;
    color: #2d4f98;
    margin-bottom: 80px;
    &::after {
      content: '次';
      font-size: 30%;
      margin-left: 6px;
    }
  }
  .instructions {
    margin: 100px 20px 0;
    padding: 10px;
    border: 2px solid #2d4f98;
    font-size: 14px;
    .title {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      img {
        height: 20px;
        width: 20px;
        margin-right: 8px;
      }
    }
    p {
      margin: 5px 0;
    }
  }
}
</style>
