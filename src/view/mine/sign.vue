<template>
  <div>
    <navbar title="每日签到" />
    <div class="mine_sign">
      <button :class="['btn',isSign?'active':'']" @click="onSign">
        <span>{{isSign?'您&nbsp;&nbsp;&nbsp;已':'点&nbsp;&nbsp;&nbsp;击'}}</span>
        <span>签&nbsp;&nbsp;&nbsp;到</span>
      </button>
      <div class="instructions">
        <p class="title">
          <img src="@/assets/images/sign.png" alt /> 签到说明：
        </p>
        <p>1、每天限前2000名签到的用户将会获得碗碟清洗优惠券；</p>
        <p>2、原价10元的碗碟清洗服务，使用优惠券仅1.99元/次！</p>
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
    navbar
  },
  data() {
    return {
      isSign: 0
    }
  },
  methods: {
    getData() {
      axios.get('/api/user/get').then(res => {
        this.isSign = res.data.isSign
      })
    },
    onSign() {
      if (this.isSign) return
      axios.post('/api/user/sign_in').then(res => {
        console.log(res.data)
        if (res.data.isAward) {
          this.$toast('恭喜您获得碗碟清洗优惠券一张，快去我的优惠券页面使用吧~')
        } else {
          this.$toast('手慢了,明天再来签到吧~')
        }
        this.isSign = 1
      })
    }
  },
  created() {
    if (!sessionStorage.getItem('token')) {
      sessionStorage.setItem('jump', 'sign')
      this.$router.replace({
        name: 'index'
      })
      return
    }
    this.getData()
    document.title = '市井&轻松装'
  }
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
  .btn {
    margin-top: 100px;
    width: 110px;
    font-size: 22px;
    // letter-spacing: 10px;
    // padding-left: 15px;
    height: 110px;
    background-color: #2d4f98;
    color: #fff;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-weight: bold;
    border: none;
    span {
      margin: 4px 0;
    }
    &::after {
      border: none;
    }
  }
  .active {
    background-color: #4b6cb3;
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
