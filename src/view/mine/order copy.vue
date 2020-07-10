<template>
  <div class="order_container">
    <van-tabs v-model="active" @click="onTabs" color="#0081ff">
      <van-tab name="all" title="全部"></van-tab>
      <van-tab name="0" title="未付款"></van-tab>
      <van-tab name="1" title="已付款"></van-tab>
      <van-tab name="2" title="已失效"></van-tab>
      <van-tab name="3" title="已完成"></van-tab>
    </van-tabs>
    <van-list
      v-model="isLoading"
      :finished="finished"
      offset="150"
      finished-text="没有更多了"
      @load="getMore"
      style="background-color: #f4f5f5;"
    >
      <div class="infoO" v-for="item in dataList" :key="item.order_id">
        <van-cell class :title="item.order_id" :value="item.order_status_china" />
        <div v-if="item.info_id_prefix === 'IF'" @click="goDetail(item)" class="info_item">
          <van-image
            fit="cover"
            class="info_itemL"
            radius="10"
            width="100"
            height="100"
            :src="item.device_gallery||logo_img"
          />
          <div class="info_itemR">
            <div>信息编号：{{item.info_id}}</div>
            <div>订单：{{item.info_type}}</div>
            <div>类型： {{item.device_type}}</div>
            <div>地区： {{item.contact_area}}</div>
            <div>
              维修价：
              <span class="price">{{item.maintain_price}}</span>
            </div>
            <div>
              <van-tag v-if="item.device_gallery" type="primary">有图片</van-tag>
              <van-tag v-if="item.device_debug_video" type="success">调试视频</van-tag>
              <van-tag v-if="item.device_demo_video" type="warning">样机视频</van-tag>
              <van-tag v-if="item.discount" type="danger">{{item.discount}}</van-tag>
            </div>
            <div class="con_bot">
              <div class="left">
                <div class="time">{{item.create_time}}</div>
              </div>
              <div class="right">
                <p class="num">已被{{item.buy_count}}人查看</p>
                <!-- <p class="price">{{item.info_buy_price}}</p> -->
              </div>
            </div>
          </div>
        </div>
        <div v-else @click="goDetail(item)" class="info_item">
          <div class="info_itemR">
            <div>接单地区：{{item.service_area}}</div>
            <div style="color:#999">维修类型</div>
            <div>KN95口罩机：{{item.kn_device_type}}</div>
            <div>平面口罩机：{{item.pm_device_type}}</div>
            <div>
              最低价格：
              <span class="price">{{item.e_maintain_price}}</span>
            </div>
            <div>
              <van-tag v-if="item.is_can_stay" type="success">长期驻点</van-tag>
              <van-tag type="danger">{{item.engineer_experience}}年经验</van-tag>
            </div>
            <div class="con_bot">
              <div class="left">
                <div class="time">{{item.create_time}}</div>
              </div>
              <div class="right">
                <p class="num">已被{{item.e_buy_count}}人查看</p>
              </div>
            </div>
          </div>
        </div>
        <div v-if="item.order_status===0||item.order_status===1" class="orderM_bot">
          <van-button
            v-if="item.order_status===1&&item.info_id_prefix === 'IF'"
            @click="onOver(item)"
            plain
            round
            type="danger"
          >已失效</van-button>
          <van-button
            v-if="item.order_status===1&&item.info_id_prefix === 'IF'"
            @click="onConfirm(item)"
            plain
            round
            type="info"
          >完成</van-button>
          <van-button
            v-if="item.order_status===0"
            @click="onPay(item)"
            plain
            round
            type="primary"
          >去支付</van-button>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
import { Dialog } from 'vant'
import axios from 'axios'
import orderItem from '@/components/order-item.vue'

export default {
  name: 'order',
  components: {
    orderItem
  },
  data() {
    return {
      logo_img: require('@/assets/images/logo-min.png'),
      active: this.$route.params.status || 'all',
      order_status: this.$route.params.status || 'all',
      page: 0,
      limit: 4,
      isLoading: false,
      finished: false,
      dataList: []
    }
  },
  methods: {
    onTabs(name, title) {
      this.order_status = name
      this.dataList = []
      this.page = 1
      this.getData()
    },
    //加载更多
    getMore() {
      this.page++
      this.getData()
    },
    //获取列表
    getData() {
      let that = this
      axios
        .get('/api/order/list', {
          params: {
            token: sessionStorage.getItem('token'),
            order_status: that.order_status,
            limit: that.limit,
            page: that.page
          }
        })
        .then(function(res) {
          let resD = res.data
          if (resD.length < that.limit) {
            console.log(1)
            that.finished = true
          }
          if (resD.length !== 0) {
            that.dataList = that.dataList.concat(
              resD.map(item => {
                item.device_type = item.device_type.join(',')
                item.contact_area = item.contact_area.join(',')
                return item
              })
            )
            console.log(that.dataList)
          }
          that.isLoading = false
        })
    },
    onConfirm(item) {
      Dialog.confirm({
        title: '完成确认',
        message: '是否确认该订单已完成？'
      }).then(() => {
        axios
          .post('/api/order/done', {
            token: sessionStorage.getItem('token'),
            order_id: item.order_id
          })
          .then(() => {
            this.$toast.success('操作成功')
            item.order_status = 3
            item.order_status_china = '已完成'
          })
      })
    },
    onOver(item) {
      Dialog.confirm({
        title: '失效确认',
        message: '是否确认该订单已失效？'
      }).then(() => {
        axios
          .post('/api/order/cancel', {
            token: sessionStorage.getItem('token'),
            order_id: item.order_id
          })
          .then(() => {
            this.$toast.success('操作成功')
            item.order_status = 2
            item.order_status_china = '已失效'
          })
      })
    },
    onPay(item) {
      Dialog.confirm({
        title: '付款确认',
        message: '是否确认付款购买该信息？'
      }).then(() => {
        axios
          .post('/api/order/anew_pay', {
            token: sessionStorage.getItem('token'),
            // info_id: item.info_id
            order_id: item.order_id
          })
          .then(resF => {
            if (typeof WeixinJSBridge === 'undefined') {
              this.$toast({
                message: '请使用微信内置浏览器进行支付'
              })
            } else if (JSON.stringify(resF.data) === '[]') {
              this.$router
                .push({
                  name:
                    item.info_id_prefix === 'IF'
                      ? 'infoDetail'
                      : 'masterDetail',
                  params: {
                    id: item.info_id
                  }
                })
                .then(() => {
                  this.$toast.success('免支付成功')
                })
            } else {
              WeixinJSBridge.invoke(
                'getBrandWCPayRequest',
                {
                  token: sessionStorage.getItem('token'),
                  appId: 'wx9ceb9cf42e04a3ac', // 公众号名称，由商户传入
                  timeStamp: resF.data.timeStamp, // 时间戳，自1970年以来的秒数
                  nonceStr: resF.data.nonceStr, // 随机串
                  package: resF.data.package,
                  signType: resF.data.signType, // 微信签名方式：
                  paySign: resF.data.paySign // 微信签名
                },
                res => {
                  if (res.err_msg === 'get_brand_wcpay_request:ok') {
                    this.$router
                      .push({
                        name:
                          item.info_id_prefix === 'IF'
                            ? 'infoDetail'
                            : 'masterDetail',
                        params: {
                          id: item.info_id
                        }
                      })
                      .then(() => {
                        this.$toast.success('支付成功')
                      })
                  } else {
                    this.$toast('支付失败')
                  }
                }
              )
            }
          })
      })
    },
    goDetail(item) {
      let that = this
      if (item.order_status === -1) {
        this.$toast('订单已取消')
      } else if ([2, 0].includes(item.order_status)) {
        this.onPay(item)
      } else {
        that.$router.push({
          name: item.info_id_prefix === 'IF' ? 'infoDetail' : 'masterDetail',
          params: {
            id: item.info_id
          }
        })
      }
    }
  },
  created() {
    // if (!sessionStorage.getItem('token')) {
    //   this.$router.replace({
    //     name: 'index'
    //   })
    //   return
    // }
    document.title = '我的订单'
  }
}
</script>

<style scoped lang="less">
@import url('../../assets/css/order.less');
</style>
