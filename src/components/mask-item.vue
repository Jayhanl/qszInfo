<template>
  <div class="info_con">
    <div @click="goDetail(item)" class="info_item" v-for="item in dataList" :key="item.info_id">
      <van-image
        fit="cover"
        class="info_itemL"
        radius="10"
        width="100"
        height="100"
        :src="item.device_gallery"
      />
      <div class="info_itemR">
        <div>编号：{{item.info_id}}</div>
        <div>订单：{{item.info_type}}</div>
        <div>类型：{{item.device_type}}</div>
        <div>地区：{{item.contact_area}}</div>
        <div>维修价：<span class="price">{{item.maintain_price}}</span></div>
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
            <p class="price">{{item.is_buy?'免费':item.info_buy_price}}</p>
          </div>
        </div>
        <p class="num">已被{{item.buy_count}}人查看</p>
      </div>
    </div>
  </div>
</template>
<script>
import { Dialog } from 'vant'
import axios from 'axios'
import qs from 'qs'
export default {
  name: 'mask-item',
  data() {
    return {
      teacherImg: require('@/assets/images/banner.jpg')
    }
  },
  props: {
    dataList: {
      type: Array,
      default: []
    }
  },
  methods: {
    goDetail(item) {
      let that = this
      console.log(sessionStorage.getItem('hasPhone'))
      if (sessionStorage.getItem('hasPhone')==0) {
        this.hasPhone()
      }else if (item.is_buy) {
        that.$router.push({
          name: 'infoDetail',
          params: {
            id: item.info_id
          }
        })
      }else {
        console.log(item.free_num);
        if (sessionStorage.getItem('is_used_free') == 0) {
          Dialog.confirm({
            title: '查看确认',
            message: '您是新用户有一次免费查看信息的机会，确定要用吗？'
          }).then(() => {
            sessionStorage.setItem('is_used_free',1)
            that.$router.push({
              name: 'infoDetail',
              params: {
                id: item.info_id
              }
            })
          })
        } else if (item.free_num > 0) {
          Dialog.confirm({
            title: '查看确认',
            message: `您有 ${item.free_num} 次免费查看信息的机会，确定要用吗？`
          }).then(() => {
            that.$router.push({
              name: 'infoDetail',
              params: {
                id: item.info_id
              }
            })
          })
        }else {
          Dialog.confirm({
            title: '付费确认',
            message: '您还未购买本信息，确定要购买吗？'
          }).then(() => {
            axios
              .post(
                '/order/create',
                qs.stringify({
                  token: sessionStorage.getItem('token'),
                  info_id: item.info_id
                })
              )
              .then(resF => {
                if (typeof WeixinJSBridge === 'undefined') {
                  that.$toast({
                    message: '请使用微信内置浏览器进行支付'
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
                        that.$router
                          .push({
                            name: 'infoDetail',
                            params: {
                              id: item.info_id
                            }
                          })
                          .then(() => {
                            this.$toast.success('支付成功')
                          })
                      } else {
                        that.$toast('支付失败')
                      }
                    }
                  )
                }
              })
          })
        }
      } 
      // else {
      //   that.$router.push({
      //     name: 'infoDetail',
      //     params: {
      //       id: item.info_id
      //     }
      //   })
      // }
    },
    hasPhone() {
      Dialog.confirm({
        title: '手机绑定',
        message: '您尚未绑定手机，是否前去绑定？'
      })
        .then(() => {
          this.$router.push({
            name: 'login'
          })
        })
    }
  },
  created() {
    // this.hasPhone()
  }
}
</script>
<style scoped>
.info_con {
  margin: 10px 3%;
  background-color: #fff;
}

.info_item {
  /* min-height: 170px; */
  display: flex;
  flex-direction: row;
  /* align-items: center; */
  padding: 15px 12px;
  margin: 10px 0;
  color: #0c0c0c;
  box-shadow: 0px 0px 10px #eee;
  border-radius: 10px;
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
}
.info_item .price {
  font-size: 20px;
  font-weight: bold;
  color: #e54d42;
}
.info_item .price::before {
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
</style>
