<template>
  <div class="order_container">
    <navbar title="服务订单" />
    <van-tabs v-model="orderStatus" @click="onTabs" color="#2d4f98">
      <van-tab :name="1" title="进行中"></van-tab>
      <van-tab :name="0" title="已结束"></van-tab>
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
        <div @click="goDetail(item.id)" class="info_item">
          <van-image
            fit="cover"
            class="info_itemL"
            radius="10"
            width="100"
            height="100"
            :src="logo_img"
          />
          <div class="info_itemR">
            <div>姓名: {{item.contactName}}</div>
            <!-- <div>联系电话: {{item.contactMobile}}</div> -->
            <div>详细地址: {{item.contactAddr}}</div>
            <div>服务: {{item.serviceItem}}</div>
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
        <div
          v-if="item.orderStatus===1||(item.orderStatus===2||item.orderStatus===3||item.orderStatus===4&&item.addTimeId===0&&item.discountType===9)"
          class="orderM_bot"
        >
          <van-button v-if="item.orderStatus===1" @click="onCancel(item)" plain round>取消</van-button>
          <!-- <van-button
            v-if="(item.orderStatus===2||item.orderStatus===3||item.orderStatus===4)&&item.addTimeId===0&&item.discountType===9"
            @click="onAddTime(item.id)"
            type="primary"
            round
          >追单</van-button> -->
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
import axios from 'axios'
import navbar from '@/components/navbar.vue'

export default {
  name: 'order',
  components: {
    navbar,
  },
  data() {
    return {
      logo_img: 'https://qjz.oss-cn-shenzhen.aliyuncs.com/images/logo-min.png',
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
        .get(
          '/api/order/' + (this.orderStatus ? 'ordering_list' : 'ordered_list'),
          {
            params: {
              limit: that.limit,
              page: that.page,
            },
          }
        )
        .then(function (res) {
          let resD = res.data
          if (resD.length < that.limit) {
            console.log(1)
            that.finished = true
          }
          if (resD.length !== 0) {
            that.dataList = load ? that.dataList.concat(resD) : resD
            console.log(that.dataList)
          }
          that.isLoading = false
        })
    },
    goDetail(id) {
      this.$router.push({
        name: 'order_detail',
        params: {
          id,
        },
      })
    },
    //取消订单
    onCancel(item) {
      this.$dialog
        .confirm({
          title: '取消确认',
          message: '是否确认取消该订单，订单金额将原路返回',
        })
        .then(() => {
          axios
            .post('/api/order/cancel', {
              id: item.id,
            })
            .then(() => {
              this.$toast.success('操作成功')
              this.page = 1
              this.getData()
            })
        })
    },
    //确认加单
    onAddTime(id) {
      this.$dialog
        .confirm({
          title: '确认加单',
          message: '您已购买上门清洁服务套餐，半价即享加单1小时',
        })
        .then(() => {
          axios
            .post('/api/order/add_time', {
              id: id,
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
                      this.$router
                        .replace({
                          name: 'mine',
                        })
                        .then(() => {
                          sessionStorage.removeItem('form')
                          this.$route.params.item = ''
                          this.$toast.success('加单成功')
                        })
                    } else {
                      this.$toast('支付失败')
                    }
                  }
                )
              } 
              // else {
              //   sessionStorage.removeItem('form')
              //   this.$route.params.item = ''
              //   this.$toast.success('加单成功')
              // }
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
    // this.orderStatus = this.$route.params.status
    this.getData()
    // document.title = '我的订单'
  },
}
</script>

<style scoped lang="less">
@import url('../../assets/css/order.less');
</style>
