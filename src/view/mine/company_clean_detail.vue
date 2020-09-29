<template>
  <div class="orderD_container">
    <navbar title="订单详情" />
    <p class="title">企业信息</p>
    <van-cell-group>
      <van-cell title="单位名称:" :value="dataD.companyName" />
      <van-cell title="联系人:" :value="dataD.contactName" />
      <van-cell title="联系电话:" :value="dataD.contactMobile" />
      <van-cell title="详细地址:" :value="dataD.companyAddr" />
      <van-cell title="单位平方:" :value="dataD.areaSize" />
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
      <van-cell title="套餐类型:" :value="dataD.buyMonth===1?'月度套餐':dataD.buyMonth===6?'半年套餐':'月度套餐'" />
      <van-cell title="每月价格:" :value="dataD.unitPrice+'元'" />
      <van-cell title="购买月份:" :value="dataD.buyMonth+'个月'" />
      <van-cell title="订单总计:" :value="dataD.orderPrice+'元'" />
      <van-cell title="是否开具发票:" :value="dataD.isNeedInvoice?'是':'否'" />
      <van-cell title="下单时间:" :value="dataD.createTime" />
      <van-cell title="过审时间:" :value="dataD.auditTime" />
      <van-cell title="服务开始日期:" :value="dataD.startDate" />
      <van-cell title="服务结束日期:" :value="dataD.endDate" />
    </van-cell-group>
  </div>
</template>

<script>
import axios from 'axios'
import navbar from '@/components/navbar.vue'

export default {
  name: 'maskDetail',
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
        .get('/api/demand_order/detail', {
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
    this.dataD = this.$route.params.item
    // this.getData()
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
