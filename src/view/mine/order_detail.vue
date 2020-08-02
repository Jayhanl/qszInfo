<template>
  <div class="orderD_container">
    <navbar title="订单详情" />
    <p class="title">用户信息</p>
    <van-cell-group>
      <van-cell title="姓名:" :value="dataD.contactName" />
      <van-cell title="联系电话:" :value="dataD.contactMobile" />
      <van-cell title="详细地址:" :value="dataD.contactAddr" />
    </van-cell-group>
    <p class="title">订单信息</p>
    <van-cell-group>
      <van-cell
        title="订单编号:"
        :value="dataD.orderId"
        label="点击复制"
        v-clipboard:success="onCopy"
        v-clipboard:copy="dataD.orderId"
      />
      <van-cell title="订单状态:" :value="dataD.orderStatusChina" />
      <van-cell title="订单价格:" :value="dataD.orderPrice" />
      <van-cell title="下单时间:" :value="dataD.createTime" />
      <van-cell title="付款时间:" :value="dataD.payTime" />
    </van-cell-group>
    <p class="title">服务信息</p>
    <van-cell-group>
      <van-cell title="预约日期:" :value="dataD.yyDate" />
      <van-cell title="预约时间:" :value="dataD.yyTime+'点'" />
      <van-cell
        v-for="item in dataD.serviceList"
        :key="item.serviceId"
        :title="item.serviceName"
        :value="item.num+item.unit"
      />
    </van-cell-group>
    <p v-if="dataD.orderStatus>=2" class="title">师傅信息</p>
    <van-cell-group v-if="dataD.orderStatus>=2">
      <van-cell title="师傅姓名:" :value="dataD.name" />
      <van-cell v-if="dataD.orderStatus<5" title="联系电话:" :value="dataD.account" />
      <van-cell v-if="dataD.toGoTime" title="开始上门:" :value="dataD.toGoTime" />
      <van-cell v-if="dataD.arriveTime" title="到达时间:" :value="dataD.arriveTime" />
      <van-cell v-if="dataD.doneTime" title="完成时间:" :value="dataD.doneTime" />
    </van-cell-group>
  </div>
</template>

<script>
import axios from 'axios'
import navbar from '@/components/navbar.vue'

export default {
  name: 'orderDetail',
  components: {
    navbar,
  },
  data() {
    return {
      id: '',
      dataD: {},
    }
  },
  methods: {
    getData() {
      axios
        .get('/api/order/detail', {
          params: {
            id: this.id,
          },
        })
        .then((res) => {
          this.dataD = res.data
        })
    },
    onCopy(e) {
      this.$toast.success('复制成功')
    },
  },
  created() {
    this.id = this.$route.params.id
    this.getData()
    // document.title = '订单详情'
  },
}
</script>

<style scoped lang="less">
.orderD_container {
  height: 100vh;
  .title {
    padding: 15px 20px;
    font-size: 18px;
    font-weight: bold;
    margin: 0;
    background-color: #f4f5f5;
  }
}
</style>
