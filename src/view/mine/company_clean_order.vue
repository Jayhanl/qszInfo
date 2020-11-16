<template>
  <div class="order_container">
    <navbar title="办公保洁订单" />
    <van-tabs v-model="orderStatus" @click="onTabs" color="#2d4f98">
      <van-tab :name="0" title="未付款"></van-tab>
      <van-tab :name="1" title="待审核"></van-tab>
      <van-tab :name="2" title="已通过"></van-tab>
      <van-tab :name="-1" title="已取消"></van-tab>
    </van-tabs>
    <van-list
      v-model="isLoading"
      :finished="finished"
      offset="150"
      finished-text="没有更多了"
      @load="getMore"
      style="background-color: #f4f5f5;"
    >
      <div class="infoO" v-for="item in dataList" :key="item.orderId">
        <van-cell class :title="item.orderId" :value="item.orderStatusChina" />
        <div @click="goDetail(item)" class="info_item">
          <van-image
            fit="cover"
            class="info_itemL"
            radius="10"
            width="100"
            height="100"
            :src="'https://qjz.oss-cn-shenzhen.aliyuncs.com/images/clean.png'"
          />
          <div class="info_itemR">
            <div>单位名称: {{item.companyName}}</div>
            <div>服务次数: {{item.buyTypeChina}}</div>
            <div>套餐类型: {{item.buyMonth===1?'月度套餐':item.buyMonth===6?'半年套餐':'月度套餐'}}</div>
            <div>详细地址: {{item.companyAddr}}</div>
            <div>
              价格:
              <span class="price">{{item.orderPrice}}</span>
            </div>
            <div class="con_bot">
              <div class="left">
                <div class="time">{{item.createTime}}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="item.orderStatus===1||item.orderStatus===0" class="orderM_bot">
          <van-button v-if="item.orderStatus===1" @click="onCancel(item)" plain round>取消</van-button>
          <van-button v-if="item.orderStatus===0" @click="onPay(item)" type="primary" round>付款</van-button>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
import axios from 'axios'
import navbar from '@/components/navbar.vue'

export default {
  name: 'maskOrder',
  components: {
    navbar,
  },
  data() {
    return {
      orderStatus: this.$route.params.status || 1,
      page: 1,
      limit: 8,
      isLoading: false,
      finished: false,
      dataList: [],
    }
  },
  methods: {
    onTabs(name, title) {
      this.orderStatus = name
      this.dataList = []
      this.page = 1
      this.getData()
    },
    //加载更多
    getMore() {
      this.page++
      this.getData(true)
    },
    //获取列表
    getData(load = false) {
      let that = this
      axios
        .get('/api/demand_order/list', {
          params: {
            limit: that.limit,
            page: that.page,
            orderStatus: that.orderStatus,
          },
        })
        .then(function (res) {
          let resD = res.data
          if (resD.length < that.limit) {
            that.finished = true
          }
          if (resD.length !== 0) {
            that.dataList = load ? that.dataList.concat(resD) : resD
            console.log(that.dataList)
          }
          that.isLoading = false
        })
    },
    goDetail(item) {
      this.$router.push({
        name: 'company_clean_detail',
        params: {
          item,
        },
      })
    },
    //取消订单
    onCancel(item) {
      this.$dialog
        .confirm({
          title: '取消确认',
          message: '是否确认取消该办公保洁订单，订单金额将原路返回',
        })
        .then(() => {
          axios
            .post('/api/demand_order/cancel', {
              id: item.id,
            })
            .then(() => {
              this.$toast.success('操作成功')
              this.page = 1
              this.getData()
            })
        })
    },
    //重新付款
    onPay(item) {
      this.$dialog
        .confirm({
          title: '付款确认',
          message: `是否确认支付${item.orderPrice}元购买办公保洁${
            item.buyMonth === 1
              ? '月度套餐'
              : item.buyMonth === 6
              ? '半年套餐'
              : '月度套餐'
          }`,
        })
        .then(() => {
          axios
            .put('/api/demand_order/anew_pay', {
              id: item.id,
            })
            .then((resF) => {
              console.log(resF)
              if (typeof WeixinJSBridge === 'undefined') {
                this.$toast({
                  message: '请使用微信内置浏览器进行支付',
                })
              } else if (resF.data.timeStamp) {
                WeixinJSBridge.invoke(
                  'getBrandWCPayRequest',
                  {
                    appId: 'wx65dd7aa40a579725', // 公众号名称，由商户传入
                    timeStamp: resF.data.timeStamp, // 时间戳，自1970年以来的秒数
                    nonceStr: resF.data.nonceStr, // 随机串
                    package: resF.data.package,
                    signType: resF.data.signType, // 微信签名方式：
                    paySign: resF.data.paySign, // 微信签名
                  },
                  (res) => {
                    if (res.err_msg === 'get_brand_wcpay_request:ok') {
                      this.$toast.success('支付成功')
                      item.orderStatus = 1
                      item.orderStatusChina = '待审核'
                    } else {
                      this.$toast('支付失败')
                    }
                  }
                )
              }
            })
        })
    },
  },
  created() {
    console.log(sessionStorage.getItem('token'))
    if (!sessionStorage.getItem('token')) {
      console.log('跳转首页获取token')
      sessionStorage.setItem('url', 'order')
      console.log('ok')
      this.$router.replace({
        name: 'index',
      })
      return
    }
    console.log(this.$route.params.status)
    // this.active = this.$route.params.status
    this.orderStatus = this.$route.params.status
    this.getData()
    // document.title = '我的订单'
  },
}
</script>

<style scoped lang="less">
@import url('../../assets/css/order.less');
</style>
