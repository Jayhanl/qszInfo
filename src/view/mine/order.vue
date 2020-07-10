<template>
  <div class="order_container">
    <navbar title="我的订单" />
    <van-tabs v-model="orderStatus" @click="onTabs" color="#2d4f98">
      <van-tab name="all" title="全部"></van-tab>
      <van-tab name="0" title="未付款"></van-tab>
      <van-tab name="1" title="待派遣"></van-tab>
      <van-tab name="2" title="待完成"></van-tab>
      <van-tab name="3" title="已完成"></van-tab>
      <van-tab name="-2" title="退款中"></van-tab>
      <van-tab name="-1" title="已取消"></van-tab>
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
    navbar
  },
  data() {
    return {
      logo_img: require('@/assets/images/logo-min.png'),
      orderStatus: this.$route.params.status || 'all',
      page: 1,
      limit: 8,
      isLoading: false,
      finished: false,
      dataList: []
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
      this.getData()
    },
    //获取列表
    getData() {
      let that = this
      axios
        .get('/api/order/list', {
          params: {
            orderStatus: that.orderStatus,
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
            that.dataList = that.dataList.concat(resD)
            console.log(that.dataList)
          }
          that.isLoading = false
        })
    },
    goDetail(id) {
      this.$router.push({
        name: 'order_detail',
        params: {
          id
        }
      })
    }
  },
  created() {
      console.log(sessionStorage.getItem('token'))
    if (!sessionStorage.getItem('token')) {
      console.log('跳转首页获取token')
      sessionStorage.setItem('url', 'order')
      console.log('ok')
      this.$router.replace({
        name: 'index'
      })
      return
    }
    console.log(this.$route.params.status)
    // this.active = this.$route.params.status
    // this.orderStatus = this.$route.params.status
    this.getData()
    // document.title = '我的订单'
  }
}
</script>

<style scoped lang="less">
@import url('../../assets/css/order.less');
</style>
