<template>
  <div class="form">
    <img class="logo" src="https://qjz.oss-cn-shenzhen.aliyuncs.com/images/logo.png" />
    <!-- <div class="title">
      <span>轻/装/时/代 无/处/不/在</span>
    </div>-->

    <!-- <div v-for="(item,index) in couponList" :key="item.type" class="coupon_item">
      <div class="coupon_left">
        <span>{{item.name}}</span>
        <span class="price">
          限时优惠：
          <span class="new" style="font-size: 18px;">¥ {{item.price}}</span>
        </span>
        <p class="tips tips_servie">
          1、提供
          <span style="color:#2d4f98">{{item.time}}</span> 的上门清洁服务
        </p>
        <p v-if="item.type===7" class="tips tips_servie">2、购买后即日起可立刻续约服务使用，活动服务截止到时间2020年10月15日零点。</p>
        <p v-if="item.type===7" class="tips tips_servie">3、本活动每人仅限购买1次</p>
      </div>
      <div class="coupon_right" @click="showConfirmS = true,couponInd = index">立即抢购</div>
    </div> -->

    <!-- <div class="coupon_item">
      <van-image
        fit="cover"
        class="mask_img"
        radius="10"
        width="100"
        height="100"
        src="https://qjz.oss-cn-shenzhen.aliyuncs.com/images/mask_pm.jpg"
        @click="onShowImg('pm')"
      />
      <div class="coupon_left">
        <span>平面防护口罩（100个）</span>
        <span class="price">
          售价：
          <span class="new" style="font-size: 18px;">¥ 30</span>
        </span>
        <van-stepper
          class="num"
          v-model="form.buyNum1"
          @change="onTotal(index)"
          min="1"
          max="99"
          integer
        />
      </div>
      <div class="coupon_right" @click="onShowConfirmM('pm')">购买</div>
    </div>

    <div class="coupon_item">
      <van-image
        fit="cover"
        class="mask_img"
        radius="10"
        width="100"
        height="100"
        src="https://qjz.oss-cn-shenzhen.aliyuncs.com/images/mask_kn95.jpg"
        @click="onShowImg('kn95')"
      />
      <div class="coupon_left">
        <span>KN95口罩（50个）</span>
        <span class="price">
          售价：
          <span class="new" style="font-size: 18px;">¥ 60</span>
        </span>
        <van-stepper
          class="num"
          v-model="form.buyNum2"
          @change="onTotal(index)"
          min="1"
          max="99"
          integer
        />
      </div>
      <div class="coupon_right" @click="onShowConfirmM('kn95')">购买</div>
    </div> -->

    <br />
    <!-- 优惠券套餐确认购买弹框 -->

    <!-- 确认购买弹框 -->
    <van-dialog v-model="showConfirmS" title="上门清洁服务套餐" :show-confirm-button="false">
      <div style="text-align:left;margin:0 20px;">
        <p>
          1、提供
          <span style="color:#2d4f98">{{couponList[couponInd].time}}</span> 的上门清洁服务
        </p>
        <p>
          2、服务项目：
          <span v-for="(item,index) in couponList[couponInd].text" :key="index">{{item}}、</span>
        </p>
        <p>
          限时优惠：
          <span style="color:#f40;">{{couponList[couponInd].price}}</span> 元
        </p>
      </div>
      <div class="btnRow">
        <van-button class="cancel" round native-type="button" @click="showConfirmS = false">取消</van-button>
        <van-button class="confirm" round type="info" @click="payService">立即抢购</van-button>
      </div>
    </van-dialog>
    <!-- 口罩确认购买弹框 -->
    <van-dialog v-model="showConfirmM" title="填写信息" :show-confirm-button="false">
      <van-form ref="confirm" @submit="onConfirm">
        <van-field
          v-model="form.contactName"
          label="姓名"
          maxlength="10"
          placeholder="请输入姓名"
          :rules="[{ required: true, message: '请填写姓名' }]"
        />
        <van-field
          v-model="form.contactMobile"
          type="digit"
          maxlength="11"
          label="联系电话"
          placeholder="请输入联系电话"
          :rules="[{ required: true, message: '请填写联系电话' },{pattern:/\d{11}/,message: '请填写正确的联系电话'}]"
        />
        <van-field
          readonly
          clickable
          name="picker"
          :value="form.area"
          label="省市区"
          placeholder="点击选择省市区"
          @click="showArea = true"
          :rules="[{ required: true, message: '请选择省市区' }]"
        />
        <van-field
          v-model="form.addr"
          rows="1"
          autosize
          label="详细地址"
          type="textarea"
          placeholder="请输入详细地址"
          :rules="[{ required: true, message: '请填写详细地址' }]"
        />
        <div class="btnRow">
          <van-button class="cancel" round native-type="button" @click="showConfirmM = false">取消</van-button>
          <van-button class="confirm" round type="info" native-type="submit">立即购买</van-button>
        </div>
      </van-form>
    </van-dialog>
    <!-- 城市弹框 -->
    <van-popup v-model="showArea" position="bottom">
      <van-area :area-list="areaList" @confirm="onCity" @cancel="showArea = false" />
    </van-popup>
    <tabBar />
  </div>
</template>

<script>
import axios from 'axios'
import area from '@/assets/js/city'
import tabBar from '@/components/tabbar.vue'
import { ImagePreview } from 'vant'
export default {
  name: 'shop',
  components: {
    tabBar,
  },
  data() {
    return {
      areaList: area,
      showArea: false,
      showConfirmS: false,
      showConfirmM: false,
      userInfo: {},
      addrData: {},
      couponInd: 0,
      couponList: [
        // {
        //   type: 7,
        //   price: '99',
        //   name: '限时特价99元5次',
        //   time: '5次1小时',
        //   text: [
        //     '倒垃圾',
        //     '卫生间清洁',
        //     '简单桌面整理',
        //     '简单床铺整理',
        //     '扫地拖地',
        //     '衣服整理',
        //     '厨房清洁',
        //   ],
        // },
        // {
        //   type: 1,
        //   price: '240',
        //   name: '30分钟保洁服务套餐',
        //   time: '2个月内15次',
        //   text: [
        //     '倒垃圾',
        //     '简单桌面整理',
        //     '简单床铺整理',
        //     '扫地拖地',
        //     '衣服整理',
        //   ],
        // },
        // {
        //   type: 2,
        //   price: '348',
        //   name: '1小时保洁服务套餐',
        //   time: '2个月内15次',
        //   text: [
        //     '倒垃圾',
        //     '卫生间清洁',
        //     '简单桌面整理',
        //     '床铺整理',
        //     '扫地拖地',
        //     '衣服整理',
        //     '厨房清洁',
        //   ],
        // },
        // {
        //   type: 3,
        //   price: '400',
        //   name: '30分钟保洁服务套餐',
        //   time: '1个月内30次',
        //   text: [
        //     '倒垃圾',
        //     '卫生间清洁',
        //     '简单桌面整理',
        //     '扫地拖地',
        //     '衣服整理',
        //   ],
        // },
        // {
        //   type: 4,
        //   price: '650',
        //   name: '1小时保洁服务套餐',
        //   time: '1个月内30次',
        //   text: [
        //     '倒垃圾',
        //     '简单桌面整理',
        //     '简单床铺整理',
        //     '扫地拖地',
        //     '衣服整理',
        //     '厨房清洁',
        //   ],
        // },
        // {
        //   type: 5,
        //   price: '110',
        //   name: '1小时保洁服务套餐',
        //   time: '1个月内4次',
        //   text: [
        //     '倒垃圾',
        //     '卫生间清洁',
        //     '简单桌面整理',
        //     '简单床铺整理',
        //     '扫地拖地',
        //     '衣服整理',
        //     '厨房清洁',
        //   ],
        // },
        // {
        //   type: 6,
        //   price: '356',
        //   name: '3小时保洁服务套餐',
        //   time: '1个月内4次',
        //   text: ['日常全面保洁标准'],
        // },
      ],
      form: {
        buyNum1: 1,
        buyNum2: 1,
        maskCate: '',
        contactName: '',
        contactMobile: '',
        contactAddr: '',
      },
    }
  },
  methods: {
    onCity(arr) {
      this.form.area =
        arr[0].name +
        (arr[1].name === arr[0].name ? '' : arr[1].name) +
        arr[2].name
      console.log(arr)
      this.showArea = false
    },
    onShowConfirmS() {
      this.showConfirmS = true
    },
    onShowConfirmM(e) {
      this.form.maskCate = e
      this.showConfirmM = true
    },
    onShowImg(e) {
      ImagePreview([
        `https://qjz.oss-cn-shenzhen.aliyuncs.com/images/mask_${e}.jpg`,
      ])
    },
    //购买优惠券套餐
    payService() {
      axios
        .post('/api/coupon_order/create', {
          goodsType: this.couponList[this.couponInd].type,
        })
        .then((resF) => {
          console.log(resF)
          this.showConfirmS = false
          if (typeof WeixinJSBridge === 'undefined') {
            this.$toast({
              message: '请使用微信内置浏览器进行支付',
            })
          } else {
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
                  this.$dialog
                    .confirm({
                      title: '购买成功',
                      message: '请前往“我的优惠券”下单体验吧',
                      confirmButtonText: '立即下单',
                      confirmButtonColor: '#2d4f98',
                      cancelButtonText: '我知道了',
                    })
                    .then(() => {
                      this.$router
                        .replace({
                          name: 'mine',
                        })
                        .then(() => {
                          this.$router.push({
                            name: 'coupon',
                          })
                        })
                    })
                    .catch(() => {})
                } else {
                  this.$toast('支付失败')
                }
              }
            )
          }
        })
        .catch((this.showConfirmS = false))
    },
    //确认下单
    onConfirm(value) {
      this.$dialog
        .confirm({
          title: '确认下单',
          message:
            '请确认信息填写无误，下单后无法修改信息，关注“市井生活情报站”了解最新动态',
        })
        .then(() => {
          let data = {
            maskCate: this.form.maskCate,
            buyNum:
              this.form.maskCate === 'pm'
                ? this.form.buyNum1
                : this.form.buyNum2,
            contactName: this.form.contactName,
            contactMobile: this.form.contactMobile,
            contactAddr: this.form.area + this.form.addr,
          }
          axios.post('/api/mask_order/create', data).then((resF) => {
            console.log(resF)
            this.showConfirmM = false
            if (typeof WeixinJSBridge === 'undefined') {
              this.$toast({
                message: '请使用微信内置浏览器进行支付',
              })
            } else {
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
                        this.$toast.success('购买成功')
                      })
                  } else {
                    this.$toast('支付失败')
                  }
                }
              )
            }
          })
        })
        .catch((this.showConfirmM = false))
    },
  },
  created() {
    if (!sessionStorage.getItem('token')) {
      sessionStorage.setItem('jump', 'shop')
      this.$router.replace({
        name: 'index',
      })
      return
    }
  },
}
</script>

<style scoped lang="less">
@import url('../../assets/css/form.less');
.form {
  padding-bottom: 30px;
}
.tips.tips_servie {
  margin: 0;
  text-align: left;
}
.coupon_left {
  flex: 1;
  text-align: left;
}
.mask_img {
  width: 70px;
  height: 70px;
  margin-left: 15px;
}
</style>
