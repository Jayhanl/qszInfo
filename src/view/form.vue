<template>
  <div class="form">
    <img class="logo" src="../assets/images/logo.png" />
    <div class="title">
      <span>轻/装/时/代 无/处/不/在</span>
    </div>
    <div class="form_container">
      <div class="form_title">
        <p>个人信息</p>
      </div>
      <van-form @submit="onSubmit">
        <van-field
          v-model="form.contactName"
          label="姓名"
          maxlength="10"
          placeholder="请输入姓名"
          :rules="[{ required: true, message: '请填写姓名' }]"
        />
        <van-field
          v-model="form.contactMobile"
          type="digit"
          maxlength="11"
          label="联系电话"
          placeholder="请输入联系电话"
          :rules="[{ required: true, message: '请填写联系电话' },{pattern:/\d{11}/,message: '请填写正确的联系电话'}]"
        />
        <van-field
          v-model="form.code"
          clearable
          type="digit"
          maxlength="6"
          label="短信验证码"
          placeholder="请输入短信验证码"
          :rules="[{ required: true, message: '请填写短信验证码' }]"
        >
          <van-button
            @click="getCode()"
            native-type="button"
            slot="button"
            size="small"
            type="primary"
          >{{codeText}}</van-button>
        </van-field>
        <van-field value="广东省，广州" label="省市" />
        <van-field
          v-model="form.contactAddr"
          label="详细地址"
          maxlength="100"
          placeholder="请输入详细地址"
          :rules="[{ required: true, message: '请填写详细地址' }]"
        />
        <van-field
          v-model="form.houseNum"
          label="房号"
          maxlength="10"
          placeholder="请输入房号"
          :rules="[{ required: true, message: '请填写房号' }]"
        />
        <van-field
          v-model="form.houseSize"
          label="户型"
          maxlength="50"
          placeholder="x房x厅x卫"
          :rules="[{ required: true, message: '请填写户型' }]"
        />
        <div class="form_price">
          <span>
            年费价格：
            <span class="price">¥399</span>
          </span>
        </div>
        <div class="btn">
          <van-button round block type="info" native-type="submit">购买会员</van-button>
        </div>
      </van-form>
    </div>
    <br />
  </div>
</template>

<script>
import { Dialog } from 'vant'
import axios from 'axios'
import config from 'config'
export default {
  name: 'formCreate',
  data() {
    return {
      form: {
        houseSize: '',
        houseNum: '',
        contactName: '',
        contactAddr: '',
        contactMobile: '',
        code: ''
      },
      timer: '', //定时器
      codeText: '获取验证码' //验证码倒计时
    }
  },
  methods: {
    getCode() {
      const mobile = this.form.contactMobile
      if (this.timer !== '') return
      else if (mobile === undefined || !/^1[3456789]\d{9}$/.test(mobile)) {
        this.$toast('请输入正确手机号')
        return
      }
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true
      })
      axios
        .get('/login/get_register_code', {
          params: {
            mobile: mobile
          }
        })
        .then(res => {
          this.$toast.success('发送成功！')
          let time = 60
          this.timer = setInterval(res => {
            time -= 1
            console.log(time)
            this.codeText = `${time}秒后重试`
            if (time === 0) {
              clearInterval(this.timer)
              this.codeText = `获取验证码`
              this.timer = ''
            }
          }, 1000)
        })
        .catch(res => {
          this.$toast.error('获取失败，请稍后再试~')
        })
    },
    onSubmit(values) {
      let that = this
      Dialog.confirm({
        title: '购买会员',
        message: '请确认信息填写无误，购买成功后无法修改信息'
      })
        .then(() => {
          let data = {
            contactName: this.form.contactName,
            contactMobile: this.form.contactMobile,
            code: this.form.code,
            contactAddr: this.form.contactAddr,
            houseNum: this.form.houseNum,
            houseSize: this.form.houseSize
          }
          axios.post('/user/open_vip', data).then(resF => {
            console.log(resF)
            if (typeof WeixinJSBridge === 'undefined') {
              this.$toast({
                message: '请使用微信内置浏览器进行支付'
              })
            } else {
              WeixinJSBridge.invoke(
                'getBrandWCPayRequest',
                {
                  appId: 'wx9ceb9cf42e04a3ac', // 公众号名称，由商户传入
                  timeStamp: resF.data.timeStamp, // 时间戳，自1970年以来的秒数
                  nonceStr: resF.data.nonceStr, // 随机串
                  package: resF.data.package,
                  signType: resF.data.signType, // 微信签名方式：
                  paySign: resF.data.paySign // 微信签名
                },
                res => {
                  if (res.err_msg === 'get_brand_wcpay_request:ok') {
                    this.$router.replace({
                      name: 'demand',
                      success: () => {
                        this.$toast.success('购买成功')
                      }
                    })
                  } else {
                    this.$toast('支付失败')
                  }
                }
              )
            }
          })
        })
        .catch()
    }
  },
  created() {
  }
}
</script>

<style scoped lang="less">
@import url('../assets/css/form.less');
</style>
