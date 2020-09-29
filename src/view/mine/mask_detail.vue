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
      <van-cell title="口罩类型:" :value="dataD.goodsName" />
      <van-cell title="单价:" :value="dataD.unitPrice+'元'" />
      <van-cell title="购买数量:" :value="dataD.buyNum+'份'" />
      <van-cell title="订单总计:" :value="dataD.orderPrice+'元'" />
      <van-cell title="下单时间:" :value="dataD.createTime" />
      <van-cell title="付款时间:" :value="dataD.payTime" />
    </van-cell-group>
    <p class="title">快递信息</p>
    <van-cell-group>
      <van-cell title="快递公司:" :value="dataD.kdCompany||'未发货'" />
      <van-cell title="快递单号:" :value="dataD.kdOrderId||'未发货'" />
      <van-cell title="发货时间:" :value="dataD.sendTime||'未发货'" />
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
        .get('/api/mask_order/detail', {
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
