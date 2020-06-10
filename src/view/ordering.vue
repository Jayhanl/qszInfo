<template>
  <div class="demand">
    <div class="demand_container">
      <div class="demand_title">
        <p>{{dataD?'正在进行中':'暂无进行中订单'}}</p>
      </div>
      <div v-if="dataD" class="member">
        <span>服务1: {{dataD.orderService}}</span>
        <span v-if="dataD.orderServiceSec">服务2: {{dataD.orderServiceSec}}</span>
        <span>详细说明: {{dataD.orderExplain}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: 'ordering',
    data() {
      return {
        dataD: {}
      }
    },
    methods: {
      getOrder() {
        axios.get('/order/ordering_list').then(res => {
          console.log(res.data)
          this.dataD = JSON.stringify(res.data)==='[]'?false:res.data[0]
        })
      }
    },
    created() {
      if (sessionStorage.getItem("token") === '' || sessionStorage.getItem("token") === undefined) {
        this.$router.replace({
          name: 'home'
        })
        return
      }
      this.getOrder()
    }
  }

</script>

<style scoped lang="less">
  /* .ordering {
    margin: 0 16px;
  } */
  @import url('../assets/css/demand.less');

</style>
