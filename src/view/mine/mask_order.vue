<template>
  <div class="order_container">
    <navbar title="口罩订单" />
    <van-tabs v-model="orderStatus" @click="onTabs" color="#2d4f98">
      <van-tab :name="1" title="进行中"></van-tab>
      <van-tab :name="0" title="已完成"></van-tab>
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
            :src="'https://qjz.oss-cn-shenzhen.aliyuncs.com/images/mask_'+(item.goodsCate===1?'pm':'kn95')+'.jpg'"
          />
          <div class="info_itemR">
            <div>姓名: {{item.contactName}}</div>
            <!-- <div>联系电话: {{item.contactMobile}}</div> -->
            <div>详细地址: {{item.contactAddr}}</div>
            <div>口罩类型: {{item.goodsName}}</div>
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
        <div v-if="item.orderStatus===1" class="orderM_bot">
          <van-button @click="onCancel(item)" plain round>取消</van-button>
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
        .get(
          '/api/mask_order/' +
            (this.orderStatus ? 'ordering_list' : 'ordered_list'),
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
        name: 'mask_detail',
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
          message: '是否确认取消该口罩订单，订单金额将原路返回',
        })
        .then(() => {
          axios
            .post('/api/mask_order/cancel', {
              id: item.id,
            })
            .then(() => {
              this.$toast.success('操作成功')
              this.page = 1
              this.getData()
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
