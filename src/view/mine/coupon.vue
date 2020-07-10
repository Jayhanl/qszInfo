<template>
  <div class="form">
    <navbar title="我的优惠券" />
    <img class="logo" src="@/assets/images/logo.png" />
    <div class="title">
      <span>轻/装/时/代 无/处/不/在</span>
    </div>

    <div v-for="(item,index) in userInfo.cleanHalfNum" :key="index" class="coupon_item">
      <div class="coupon_left">
        <span>1小时保洁优惠券</span>
        <span class="price">
          原价：
          <span class="old">¥ 29.9</span> 折扣后：
          <span class="new">¥ 14.75</span>
        </span>
        <span class="tips">（抵扣14.75元）</span>
      </div>
      <div class="coupon_right" @click="onShowConfirm(4)">立即下单</div>
    </div>

    <div v-for="(item,index) in userInfo.cleanDiscountNum" :key="index" class="coupon_item">
      <div class="coupon_left">
        <span>2小时保洁优惠券</span>
        <span class="price">
          原价：
          <span class="old">¥ 59.8</span> 折扣后：
          <span class="new">¥ 29.9</span>
        </span>
        <span class="tips">（抵扣29.9元）</span>
      </div>
      <div class="coupon_right" @click="onShowConfirm(1)">立即下单</div>
    </div>

    <div v-for="(item,index) in userInfo.illDiscountNum" :key="index" class="coupon_item">
      <div class="coupon_left">
        <span>照明安装优惠券</span>
        <span class="price">
          原价：
          <span class="old">¥ 60</span> 折扣后：
          <span class="new">¥ 50</span>
        </span>
        <span class="tips">（抵扣10元）</span>
      </div>
      <div class="coupon_right" @click="onShowConfirm(2)">立即下单</div>
    </div>

    <div v-for="(item,index) in userInfo.carDiscountNum" :key="index" class="coupon_item">
      <div class="coupon_left">
        <span>汽车外部清洗</span>
        <span class="price">
          原价：
          <span class="old">¥ 30</span> 折扣后：
          <span class="new">¥ 20</span>
        </span>
        <span class="tips">（抵扣10元）</span>
      </div>
      <div class="coupon_right" @click="onShowConfirm(3)">立即下单</div>
    </div>

    <br />
    <!-- 确认下单弹框 -->
    <van-dialog v-model="showConfirm" title="标题" :show-confirm-button="false">
      <van-form ref="confirm" @submit="onConfirm">
        <van-field
          readonly
          :value="addrData.remark"
          label="地址标签"
          placeholder="点击选择地址"
          :rules="[{ required: true, message: '请选择地址' }]"
          @click="goAddr"
        />
        <van-field
          readonly
          clickable
          :value="form.yyDate"
          label="预约日期"
          placeholder="点击选择预约日期"
          :rules="[{ required: true, message: '请选择预约日期' }]"
          @click="showCalendar = true"
        />
        <van-field
          readonly
          clickable
          :value="form.yyTime.text"
          label="预约时间"
          placeholder="点击选择预约时间"
          :rules="[{ required: true, message: '请选择预约时间' }]"
          @click="showTime = true"
        />
        <div class="btnRow">
          <van-button class="cancel" round native-type="button" @click="showConfirm = false">取消</van-button>
          <van-button class="confirm" round type="info" native-type="submit">预约下单</van-button>
        </div>
      </van-form>
    </van-dialog>
    <!-- 弹窗的组件 -->
    <van-calendar v-model="showCalendar" :max-date="form.maxDate" @confirm="onCalendar" />
    <van-popup v-model="showTime" position="bottom">
      <van-picker show-toolbar :columns="columnsTime" @confirm="onTime" @cancel="showTime = false" />
    </van-popup>
  </div>
</template>

<script>
import axios from 'axios'
import navbar from '@/components/navbar.vue'
export default {
  name: 'coupon',
  components: {
    navbar
  },
  data() {
    return {
      showConfirm: false,
      showTime: false,
      showCalendar: false,
      userInfo: {},
      addrData: {},
      form: {
        discountType: '',
        maxDate: '',
        yyDate: '',
        yyTime: {}
      },
      columnsTime: [
        {
          id: 9,
          text: '9点'
        },
        {
          id: 10,
          text: '10点'
        },
        {
          id: 11,
          text: '11点'
        },
        {
          id: 12,
          text: '12点'
        },
        {
          id: 13,
          text: '13点'
        },
        {
          id: 14,
          text: '14点'
        },
        {
          id: 15,
          text: '15点'
        },
        {
          id: 16,
          text: '16点'
        },
        {
          id: 17,
          text: '17点'
        },
        {
          id: 18,
          text: '18点'
        },
        {
          id: 19,
          text: '19点'
        }
      ]
    }
  },
  methods: {
    //前往地址列表
    goAddr() {
      this.$router.push({
        name: 'addr_list'
      })
      sessionStorage.setItem('form', JSON.stringify(this.form))
      sessionStorage.setItem('addrChoice', 'coupon')
    },
    onShowConfirm(e) {
      this.form.discountType = parseInt(e)
      this.showConfirm = true
    },
    //选择预约日期
    onCalendar(value) {
      let date = new Date()
      let hours = date.getHours()
      this.form.yyDate = this.formatTime(value)
      this.showCalendar = false
      if (
        this.formatTime(date) === this.form.yyDate &&
        this.form.yyTime.id <= hours + 1
      ) {
        this.form.yyTime = ''
        this.$toast('请重新选择预约时间')
      }
    },
    //选择预约时间
    onTime(value) {
      let date = new Date()
      let hours = date.getHours()
      if (this.formatTime(date) === this.form.yyDate && value.id <= hours + 1) {
        this.form.yyTime = ''
        this.$toast('请预约1小时后的时间')
        return
      }
      this.form.yyTime = value
      this.showTime = false
    },
    //时间格式
    formatTime(time) {
      var date = new Date(time)
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var day = date.getDate()
      return [year, month, day]
        .map(n => {
          n = n.toString()
          return n[1] ? n : '0' + n
        })
        .join('-')
    },
    funDate(num) {
      let date1 = new Date()
      //今天时间
      let time1 =
        date1.getFullYear() +
        '-' +
        (date1.getMonth() + 1) +
        '-' +
        date1.getDate()
      console.log(time1)
      let date2 = new Date(date1)
      date2.setDate(date1.getDate() + num)
      return date2
    },
    //确认下单
    onConfirm(value) {
      this.$dialog
        .confirm({
          title: '确认下单',
          message: '请确认信息填写无误，下单后无法修改信息'
        })
        .then(() => {
          let data = {
            discountType: this.form.discountType,
            contactName: this.addrData.contactName,
            contactMobile: this.addrData.contactMobile,
            contactAddr: this.addrData.contactAddr,
            yyDate: this.form.yyDate,
            yyTime: this.form.yyTime.id,
            serviceList: '',
            isAgree: 1
          }
          axios.post('/api/order/create', data).then(resF => {
            console.log(resF)
            this.showConfirm = false
            if (typeof WeixinJSBridge === 'undefined') {
              this.$toast({
                message: '请使用微信内置浏览器进行支付'
              })
            } else {
              WeixinJSBridge.invoke(
                'getBrandWCPayRequest',
                {
                  appId: 'wxd6dceeee251fe0ad', // 公众号名称，由商户传入
                  timeStamp: resF.data.timeStamp, // 时间戳，自1970年以来的秒数
                  nonceStr: resF.data.nonceStr, // 随机串
                  package: resF.data.package,
                  signType: resF.data.signType, // 微信签名方式：
                  paySign: resF.data.paySign // 微信签名
                },
                res => {
                  if (res.err_msg === 'get_brand_wcpay_request:ok') {
                    this.$router
                      .replace({
                        name: 'mine'
                      })
                      .then(() => {
                        sessionStorage.removeItem('form')
                        this.$route.params.item = ''
                        this.$toast.success('购买成功')
                      })
                  } else {
                    this.$toast('支付失败')
                  }
                }
              )
            }
          })
        })
        .catch((this.showConfirm = false))
    },
    getData() {
      axios.get('/api/user/get').then(res => {
        this.userInfo = res.data
      })
    }
  },
  created() {
    if (!sessionStorage.getItem('token')) {
      sessionStorage.setItem('jump', 'coupon')
      this.$router.replace({
        name: 'index'
      })
      return
    }
    if (this.$route.params.item) {
      if (sessionStorage.getItem('form')) {
        this.form = JSON.parse(sessionStorage.getItem('form'))
      }
      this.showConfirm = true
      this.addrData = this.$route.params.item
    }
    // document.title = '我的优惠券'
    this.getData()
    this.form.maxDate = this.funDate(7)
  }
}
</script>

<style scoped lang="less">
@import url('../../assets/css/form.less');
</style>
