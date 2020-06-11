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
        <van-field v-model="form.contactName" label="姓名" maxlength="10" placeholder="请输入姓名"
          :rules="[{ required: true, message: '请填写姓名' }]" />
        <van-field v-model="form.contactMobile" type="digit" maxlength="11" label="联系电话" placeholder="请输入联系电话"
          :rules="[{ required: true, message: '请填写联系电话' },{pattern:/\d{11}/,message: '请填写正确的联系电话'}]" />
        <van-field v-model="form.code" clearable type="digit" maxlength="6" label="短信验证码" placeholder="请输入短信验证码"
          :rules="[{ required: true, message: '请填写短信验证码' }]">
          <van-button @click="getCode()" native-type="button" slot="button" size="small" type="primary">{{codeText}}
          </van-button>
        </van-field>
        <van-field disabled value="广东省，广州" label="省市" />
        <van-field v-model="form.contactAddr" label="详细地址" maxlength="100" placeholder="请输入详细地址"
          :rules="[{ required: true, message: '请填写详细地址' }]" />
        <van-field v-model="form.houseNum" label="房号" maxlength="10" placeholder="请输入房号"
          :rules="[{ required: true, message: '请填写房号' }]" />
        <van-field v-model="form.houseSize" label="户型" maxlength="20" placeholder="x房x厅x卫"
          :rules="[{ required: true, message: '请填写户型' }]" />
        <van-field v-model="form.employeeId" label="推荐人编号" maxlength="19" placeholder="请填写推荐人编号" />


        <!-- <van-field readonly clickable name="picker" :value="form.member.text" label="轻松装会员" placeholder="点击会员套餐"
          :rules="[{ required: true, message: '请选择会员套餐' }]" @click="showMember = true" />
        <van-popup v-model="showMember" position="bottom">
          <van-picker show-toolbar :columns="columnsMember" @confirm="onConfirm" @cancel="showMember = false" />
        </van-popup> -->
        <h3>轻松装会员</h3>
        <div class="member_combo">
          <div v-for="(item,index) in columnsMember" :class="['item',combo.month===item.month?'active':'']"
            @click="changeMember(index)">
            <span>{{item.member}}</span>
            <span>¥ <span class="price">{{item.price}}</span></span>
          </div>
        </div>

        <div class="form_price">
          <span>
            价格：
            <span class="price">¥{{combo.price}}</span>
          </span>
        </div>
        <van-checkbox class="user_agreement" v-model="form.isAgree" label-disabled checked-color="#07c160">我已经阅读并同意
          <router-link :to="{name:'agreement_user'}" class="agreement" @click="goAgreementUser">《用户协议及隐私条款》
          </router-link> 和<router-link :to="{name:'agreement_qsz'}" class="agreement">《轻松装会员服务协议》</router-link>
        </van-checkbox>
        <div class="btn">
          <van-button round block type="info" native-type="submit">购买会员</van-button>
        </div>
      </van-form>
    </div>
    <br />
  </div>
</template>

<script>
  import {
    Dialog
  } from 'vant'
  import axios from 'axios'
  import config from 'config'
  export default {
    name: 'formCreate',
    data() {
      return {
        single: '',
        form: {
          houseSize: '',
          houseNum: '',
          contactName: '',
          contactAddr: '',
          contactMobile: '',
          code: '',
          employeeId:'',
          isAgree: 0
        },
        showMember: false,
        combo: {
          month: 12,
          price: 499,
          member: '年度会员',
          text: '¥499/年(12个月)'
        },
        columnsMember: [{
          month: 12,
          price: 499,
          member: '年度会员',
          text: '¥499/年(12个月)'
        }, {
          month: 6,
          price: 299,
          member: '半年度会员',
          text: '¥299/半年(6个月)'
        }, {
          month: 3,
          price: 199,
          member: '季度会员',
          text: '¥199/季(3个月)',
        }, {
          month: 1,
          price: 99,
          member: '月度会员',
          text: '¥99/月(1个月)'
        }],
        timer: '', //定时器
        codeText: '获取验证码' //验证码倒计时
      }
    },
    methods: {
      goAgreementUser() {

      },
      changeMember(e) {
        console.log(e);
        this.combo = this.columnsMember[e]
      },
      onConfirm(value) {
        this.showMember = false
        this.form.member = value
        console.log(value);
      },
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
      },
      onSubmit(values) {
        let that = this
        if (!that.form.isAgree) {
          this.$toast('请阅读并同意协议')
          return false
        }
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
              houseSize: this.form.houseSize,
              vipMonth: this.combo.month,
              isAgree: this.form.isAgree ? 1 : 0,
              employeeId: this.form.employeeId || 0,
            }
            axios.post('/user/open_vip', data).then(resF => {
              console.log(resF)
              if (typeof WeixinJSBridge === 'undefined') {
                this.$toast({
                  message: '请使用微信内置浏览器进行支付'
                })
              } else {
                WeixinJSBridge.invoke(
                  'getBrandWCPayRequest', {
                    appId: 'wx5adf34709292134d', // 公众号名称，由商户传入
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
      console.log(sessionStorage.getItem("vipLevel"));
      console.log(sessionStorage.getItem("token"));
      if (!sessionStorage.getItem("token")) {
        this.$router.replace({
          name: 'home'
        })
        return
      }
    }
  }

</script>

<style scoped lang="less">
  @import url('../assets/css/form.less');

</style>
