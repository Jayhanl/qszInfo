<template>
  <div class="info_con">
    <div class="infoO" v-for="item in dataList" :key="item.order_id">
      <van-cell class :title="item.order_id" :value="item.order_status_china" />
      <div @click="goDetail(item)" class="info_item">
        <van-image
          class="info_itemL"
          radius="10"
          width="100"
          height="100"
          :src="item.device_gallery"
        />
        <div class="info_itemR">
          <div>设备品牌： {{item.device_brand}}</div>
          <div>设备类型： {{item.device_type}}</div>
          <div>地区： {{item.contact_area}}</div>
          <div>
            <van-tag type="primary">有图片</van-tag>
            <van-tag v-if="item.device_debug_video" type="success">调试视频</van-tag>
            <van-tag v-if="item.device_demo_video" type="warning">样机视频</van-tag>
            <van-tag v-if="item.discount" type="danger">{{item.discount}}</van-tag>
          </div>
          <div class="con_bot">
            <div class="left">
              <div class="time">{{item.create}}</div>
            </div>
            <div class="right">
              <p class="price">{{item.maintain_price}}</p>
            </div>
          </div>
          <p class="num">已被购买{{item.is_buy}}次</p>
        </div>
      </div>
      <div class="orderM_bot">
        <van-button v-if="item.order_status===1" @click="onOver(item)" plain round type="danger">已失效</van-button>
        <van-button v-if="item.order_status===1" @click="onConfirm(item)" plain round type="primary">完成</van-button>
        <van-button v-if="item.order_status===0" @click="onPay(item)" plain round type="primary">去支付</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import { Dialog } from 'vant'
export default {
  name: 'mask-item',
  data() {
    return {}
  },
  props: {
    dataList: {
      type: Array,
      default: []
    }
  },
  methods: {
    goDetail(item) {
      that.$router.push({
        name: 'infoDetail',
        params: {
          id: item.info_id
        }
      })
    },
    onOver(item){
      this.$parent.onOver(item)
    },
    onConfirm(item){
      console.log(1)
      this.$parent.onConfirm(item)
    },
    onPay(item){
      this.$parent.onPay(item)
    },
  }
}
</script>
<style scoped>
.info_con {
  margin: 10px 3%;
}

.info_item {
  display: flex;
  flex-direction: row;
  padding: 15px;
  color: #0c0c0c;
  border-bottom: 1px solid #eee;
}

.info_itemR {
  display: flex;
  flex-direction: column;
  flex: 1;
  font-size: 14px;
  margin-left: 10px;
}
.info_itemR > div {
  margin: 2px 0;
}

.info_itemR .time {
  font-size: 14px;
  color: #8799a3;
}
.info_itemR .num {
  font-size: 10px;
  color: #8799a3;
  text-align: right;
}
.info_itemR .con_bot {
  display: flex;
  flex-direction: row;
}

.con_bot .left {
  flex: 3;
}

.con_bot .right {
  display: flex;
  flex-direction: column;
  text-align: right;
  flex: 2;
  justify-content: space-between;
  color: #e54d42;
}
.right .price {
  font-size: 20px;
  font-weight: bold;
}
.right .price::before {
  content: '¥';
  font-size: 80%;
  margin-right: 4px;
}

.info_itemR .study {
  font-size: 14px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: #8799a3;
}

.info_item p {
  margin: 0;
}
.orderM_bot {
  display: flex;
  justify-content: flex-end;
  padding: 10px 16px;
}

.orderM_bot button {
  height: 26px;
  line-height: 26px;
  margin-left: 10px;
}
.infoO{
  margin: 10px 0;
  background-color: #fff;
}
</style>
