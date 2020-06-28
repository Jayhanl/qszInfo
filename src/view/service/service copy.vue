<template>
  <div class="form margin-bottom">
    <img class="logo" src="@/assets/images/logo.png" />
    <div class="title">
      <span>轻/装/时/代 无/处/不/在</span>
    </div>
    <div class="form_container">
      <!-- <div class="form_title">
        <p>个人信息</p>
      </div>-->
      <van-form @submit="onSubmit">
        <h3 style="padding-top:10px">轻松装服务</h3>
        <div class="member_combo">
          <div
            v-for="(item,index) in columnsMember"
            :key="item.id"
            :class="['item',item.choice?'active':'']"
          >
            <div @click="changeMember(index)" class="cont">
              <span class="name">{{item.name}}</span>
              <span>{{item.text}}</span>
              <span v-if="item.tips" class="tips">{{item.tips}}</span>
            </div>
            <van-stepper
              class="num"
              v-model="item.num"
              @change="onTotal(index)"
              min="0"
              max="10"
              integer
            />
          </div>
        </div>

        <div class="form_price">
          <span>
            价格：
            <span class="price">¥{{totalPrice}}</span>
          </span>
        </div>
        <van-checkbox
          class="user_agreement"
          v-model="form.isAgree"
          label-disabled
          checked-color="#07c160"
        >
          我已经阅读并同意
          <router-link :to="{name:'agreement_qsz'}" class="agreement">《轻松装管家服务协议》</router-link>
        </van-checkbox>
        <div class="btn">
          <van-button round block type="info" native-type="submit">确认下单</van-button>
        </div>
      </van-form>
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
        <van-picker
          show-toolbar
          :columns="columnsTime"
          @confirm="onTime"
          @cancel="showTime = false"
        />
      </van-popup>
    </div>
    <br />
    <tabBar></tabBar>
  </div>
</template>

<script>
import axios from 'axios'
import tabBar from '@/components/tabbar.vue'
export default {
  name: 'service',
  components: {
    tabBar
  },
  data() {
    return {
      showConfirm: false,
      showTime: false,
      showCalendar: false,
      form: {
        maxDate: '',
        yyDate: '',
        yyTime: {},
        isAgree: 0
      },
      addrData: {},
      combo: 0,
      totalPrice: 0,
      columnsTime: [
        {
          id: 9,
          text: '9点'
        },
        {
          id: 11,
          text: '11点'
        },
        {
          id: 13,
          text: '13点'
        },
        {
          id: 15,
          text: '15点'
        },
        {
          id: 17,
          text: '17点'
        },
        {
          id: 19,
          text: '19点'
        }
      ],
      columnsMember: [
        {
          id: 1,
          num: 0,
          choice: false,
          price: 100,
          name: '通厕所',
          text: '100元(包通成)',
          tips: ''
        },
        {
          id: 2,
          num: 0,
          choice: false,
          price: 70,
          name: '管道疏通',
          text: '70元',
          tips: ''
        },
        {
          id: 3,
          num: 0,
          choice: false,
          price: 60,
          name: '水龙头花洒安装',
          text: '60元/个任务',
          tips: '1小时内(不含物料)'
        },
        {
          id: 4,
          num: 0,
          choice: false,
          price: 80,
          name: '桌椅柜门窗维护',
          text: '80元/个任务',
          tips: ''
        },
        {
          id: 5,
          num: 0,
          choice: false,
          price: 100,
          name: '桌椅柜安装',
          text: '100元/个任务',
          tips: '(3个内)'
        },
        {
          id: 6,
          num: 0,
          choice: false,
          price: 30,
          name: '换灯泡',
          text: '30元/个灯泡',
          tips: '(不含物料)'
        },
        {
          id: 7,
          num: 0,
          choice: false,
          price: 60,
          name: '照明设备安装',
          text: '60元/套',
          tips: ''
        },
        {
          id: 8,
          num: 0,
          price: 65,
          name: '搬运',
          text: '65元/人/小时',
          tips: ''
        },
        {
          id: 9,
          num: 0,
          choice: false,
          price: 50,
          name: '家具整理清洁',
          text: '50元/小时',
          tips: '(不含家电清洗及家具清洁)'
        },
        {
          id: 10,
          num: 0,
          choice: false,
          price: 30,
          name: '汽车外部清洗',
          text: '30元/次',
          tips: ''
        }
      ]
    }
  },
  methods: {
    //选择服务
    changeMember(index) {
      console.log(index)
      this.columnsMember[index].choice = !this.columnsMember[index].choice
      if (this.columnsMember[index].num === 0) this.columnsMember[index].num = 1
      this.onTotal()
    },
    //前往地址列表
    goAddr() {
      this.$router.push({
        name: 'addr_list'
      })
      sessionStorage.setItem(
        'columnsMember',
        JSON.stringify(this.columnsMember)
      )
      sessionStorage.setItem('form', JSON.stringify(this.form))
      sessionStorage.setItem('addrChoice', 'service')
    },
    //选择预约日期
    onCalendar(value) {
      this.form.yyDate = this.formatTime(value)
      this.showCalendar = false
    },
    //选择预约时间
    onTime(value) {
      this.form.yyTime = value
      this.showTime = false
    },
    onTotal(index) {
      if (index !== undefined) this.columnsMember[index].choice = true
      let sum = 0
      this.columnsMember
        .filter(item => item.choice)
        .forEach(item => {
          sum += this.accMul(item.num, item.price)
        })
      this.totalPrice = sum
    },
    //乘法
    accMul(arg1, arg2) {
      var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString()
      try {
        m += s1.split('.')[1].length
      } catch (e) {}
      try {
        m += s2.split('.')[1].length
      } catch (e) {}
      return (
        (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
        Math.pow(10, m)
      )
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
    onSubmit(values) {
      if (!this.form.isAgree) {
        this.$toast('请阅读并同意协议')
        return false
      }
      let arr = this.columnsMember.filter(item => item.choice)
      if (arr.length === 0) {
        this.$toast('请至少选择一项服务')
        return false
      }
      this.showConfirm = true
    },
    onTry() {
      // console.log(this.$refs.confirm)
      // this.$refs.confirm.$el.click()
    },
    //确认下单
    onConfirm(value) {
      this.$dialog
        .confirm({
          title: '确认下单',
          message: '请确认信息填写无误，下单后无法修改信息'
        })
        .then(() => {
          let list = this.columnsMember
            .filter(item => item.choice)
            .map(item => {
              return (item = {
                service_id: item.id,
                num: item.num
              })
            })
          console.log(list)
          let data = {
            discountType: 0,
            contactName: this.addrData.contactName,
            contactMobile: this.addrData.contactMobile,
            contactAddr: this.addrData.contactAddr,
            yyDate: this.form.yyDate,
            yyTime: this.form.yyTime.id,
            serviceList: list,
            isAgree: this.form.isAgree ? 1 : 0
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
                        this.$toast.success('购买成功')
                        sessionStorage.removeItem('form')
                        sessionStorage.removeItem('columnsMember')
                        this.$route.params.item = ''
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
    }
  },
  created() {
    if (!sessionStorage.getItem('token')) {
      sessionStorage.setItem('url', 'service')
      this.$router.replace({
        name: 'index'
      })
      return
    }
    if (this.$route.params.item) {
      console.log(this.$route.params.item)
      if (sessionStorage.getItem('columnsMember')) {
        this.columnsMember = JSON.parse(sessionStorage.getItem('columnsMember'))
        this.form = JSON.parse(sessionStorage.getItem('form'))
        this.onTotal()
      }
      this.showConfirm = true
      this.addrData = this.$route.params.item
    }
    this.form.maxDate = this.funDate(7)
    document.title = '市井&轻松装'
  },
  destroyed() {
    console.log(123321321312)
  }
}
</script>

<style scoped lang="less">
@import url('../../assets/css/form.less');
</style>
