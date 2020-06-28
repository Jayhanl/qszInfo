<template>
  <div class="form">
    <img class="logo" src="@/assets/images/sjLogo.png" />
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
        <van-field v-model="form.employeeId" label="推荐人编号" maxlength="19" placeholder="请填写推荐人编号" />
        <van-checkbox
          class="user_agreement"
          v-model="form.isAgree"
          label-disabled
          checked-color="#07c160"
        >
          我已经阅读并同意
          <router-link
            :to="{name:'agreement_user'}"
            class="agreement"
            @click="goAgreementUser"
          >《用户协议及隐私条款》</router-link>
        </van-checkbox>
        <div class="btnRow">
          <van-button class="cancel" round native-type="button" @click="onCancel">取消</van-button>
          <van-button class="confirm" round type="info" native-type="submit">注册</van-button>
        </div>
      </van-form>
    </div>
    <br />
  </div>
</template>

<script>
import { Dialog } from 'vant'
import axios from 'axios'
export default {
  name: 'register',
  data() {
    return {
      single: '',
      form: {
        contactName: '',
        contactMobile: '',
        code: '',
        employeeId: '',
        isAgree: 0
      },
      timer: '', //定时器
      codeText: '获取验证码' //验证码倒计时
    }
  },
  methods: {
    goAgreementUser() {},
    changeMember(e) {
      console.log(e)
      this.combo = this.columnsMember[e]
    },
    onCancel(){
      this.$router.push({
        name:'service'
      })
    },
    onConfirm(value) {
      this.showMember = false
      this.form.member = value
      console.log(value)
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
        .get('/api/login/get_register_code', {
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
        title: '用户注册',
        message: '请确认信息填写无误，注册成功后无法修改信息'
      })
        .then(() => {
          let data = {
            contactName: this.form.contactName,
            contactMobile: this.form.contactMobile,
            code: this.form.code,
            isAgree: this.form.isAgree ? 1 : 0,
            employeeId: this.form.employeeId || 0
          }
          axios.put('/api/user/update_base_info', data).then(resF => {
            console.log(resF)
            this.$router.replace({
              name: 'mine'
            }).then(()=>{
              this.$router.push({
                name:'coupon'
              }).then(this.$toast.success('注册成功'))
            })
          })
        })
        .catch()
    }
  },
  created() {
    document.title = '市井会员'
    if (!sessionStorage.getItem('token')) {
      this.$router.replace({
        name: 'index'
      })
      return
    }
  }
}
</script>

<style scoped lang="less">
@import url('../../assets/css/form.less');
</style>
