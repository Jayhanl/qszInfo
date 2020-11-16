<template>
  <div class="form">
    <img class="logo" src="https://qjz.oss-cn-shenzhen.aliyuncs.com/images/logo.png" />
    <div class="form_container">
      <div class="form_title">
        <p>办公保洁</p>
      </div>
      <van-form @submit="onSubmit">
        <van-field
          v-model="form.companyName"
          label="单位名称"
          maxlength="10"
          placeholder="请输入单位名称"
          :rules="[{ required: true, message: '请填写单位名称' }]"
        />
        <van-field
          v-model="form.contactName"
          label="联系人"
          maxlength="10"
          placeholder="请输入联系人"
          :rules="[{ required: true, message: '请填写联系人' }]"
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
        <van-field
          v-model="form.areaSize"
          @input="onTotal"
          type="digit"
          label="区域平方数"
          maxlength="5"
          placeholder="请如实填写,工作人员将二次审核"
          :rules="[{ required: true, message: '请填写区域平方数' }]"
        />
        <van-field label="选择套餐">
          <template #input>
            <van-radio-group v-model="form.buyType" direction="horizontal">
              <van-radio :name="3" checked-color="#2d4f98">每月12次</van-radio>
              <van-radio :name="2" checked-color="#2d4f98">每月4次</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <!-- 套餐 -->
        <div class="member_combo">
          <div :class="['item',combo === 1?'active':'']" @click="changeCombo(1)">
            <div class="cont">
              <span>月度套餐</span>
              <span class="nowPrice">{{monthPrice * (form.buyType===2?0.5:1)}}</span>
            </div>
          </div>
          <div :class="['item',combo === 6?'active':'']" @click="changeCombo(6)">
            <div class="cont">
              <span>半年套餐</span>
              <span class="nowPrice">{{halfYearPrice * (form.buyType===2?0.5:1)}}</span>
              <span class="oldPrice">¥ {{halfYearOldPrice * (form.buyType===2?0.5:1)}}</span>
            </div>
          </div>
          <div :class="['item',combo === 12?'active':'']" @click="changeCombo(12)">
            <div class="cont">
              <span>年度套餐</span>
              <span class="nowPrice">{{yearPrice * (form.buyType===2?0.5:1)}}</span>
              <span class="oldPrice">¥ {{yearOldPrice * (form.buyType===2?0.5:1)}}</span>
            </div>
          </div>
        </div>
        <!-- <van-field label="租赁平方数合同(非必传)">
          <template #input>
            <van-uploader v-model="fileList" :max-count="1" :after-read="uploadFile" />
          </template>
        </van-field>-->
        <van-field label="是否需要发票">
          <template #input>
            <van-radio-group v-model="form.isNeedInvoice" direction="horizontal">
              <van-radio :name="1" checked-color="#2d4f98">是</van-radio>
              <van-radio :name="0" checked-color="#2d4f98">否</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <div class="form_tips">服务区域暂时仅限广州地区，服务价格不包含税率</div>
        <div class="form_tips">面积400㎡以下都计400㎡，超出的平方按1元1方计(每月4次套餐按0.5元1方计)</div>
        <div class="form_tips">
          每张订单收取
          <span style="color:#f40">500元保证金</span>，使用服务满1年后可全额退还
        </div>

        <van-checkbox
          class="user_agreement"
          v-model="form.isAgree"
          label-disabled
          checked-color="#2d4f98"
        >
          我已经阅读并同意
          <router-link :to="{name:'agreement_qsz'}" class="agreement">《轻家政会员服务协议》</router-link>
        </van-checkbox>
        <div class="btnRow">
          <van-button class="cancel" round native-type="button" @click="onCancel">返回</van-button>
          <van-button class="confirm" round type="info" native-type="submit">立即购买</van-button>
        </div>
      </van-form>
      <!-- 城市弹框 -->
      <van-popup v-model="showArea" position="bottom">
        <van-area :area-list="areaList" @confirm="onCity" @cancel="showArea = false" />
      </van-popup>
    </div>
    <br />
    <tabBar />
  </div>
</template>

<script>
import axios from 'axios'
import area from '@/assets/js/areaGz'
import tabBar from '@/components/tabbar.vue'
export default {
  name: 'company_clean',
  components: {
    tabBar,
  },
  data() {
    return {
      combo: 1,
      areaList: area,
      showArea: false,
      form: {
        contactName: '',
        contactMobile: '',
        companyName: '',
        area: '',
        addr: '',
        areaSize: '',
        isNeedInvoice: 0,
        buyType: 3,
        contract: '',
        isAgree: 0,
      },
      fileList: [],
      monthPrice: 400, //月度优惠后总价
      halfYearPrice: 2200, //半年优惠后总价
      yearPrice: 4400, //年度优惠后总价
      halfYearOldPrice: 2400, //半年优惠前总价
      yearOldPrice: 4800, //年度优惠前总价
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
    onCancel() {
      this.$router.push({
        name: 'service',
      })
    },
    onConfirm(value) {
      this.showMember = false
      this.form.member = value
      console.log(value)
    },
    //选择服务
    changeCombo(index) {
      this.combo = index
    },
    //计算价格
    onTotal(e) {
      this.monthPrice = this.form.areaSize > 400 ? this.form.areaSize : 400
      this.halfYearPrice = this.accMul(this.monthPrice, 5.5)
      this.yearPrice = this.accMul(this.monthPrice, 11)
      this.halfYearOldPrice = this.accMul(this.monthPrice, 6)
      this.yearOldPrice = this.accMul(this.monthPrice, 12)
    },
    //乘法
    accMul(arg1, arg2) {
      var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString()
      try {
        m += s1.split('.')[1].length
      } catch (e) {}
      try {
        m += s2.split('.')[1].length
      } catch (e) {}
      return (
        (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
        Math.pow(10, m)
      )
    },
    // 上传图片
    uploadFile(file) {
      this.form.contract = file.content
      console.log(this.form.contract)
    },
    //立即购买
    onSubmit(values) {
      let that = this
      if (!that.form.isAgree) {
        this.$toast('请阅读并同意协议')
        return false
      }
      this.$dialog
        .confirm({
          title: '办公保洁套餐',
          message: '请确认信息填写无误，购买成功后无法修改信息',
        })
        .then(() => {
          let data = {
            contactName: this.form.contactName,
            contactMobile: this.form.contactMobile,
            companyName: this.form.companyName,
            companyAddr: this.form.area + this.form.addr,
            areaSize: this.form.areaSize,
            buyType: this.form.buyType,
            isNeedInvoice: this.form.isNeedInvoice,
            // contract: this.form.contract,
            buyMonth: this.combo,
          }
          axios.post('/api/demand_order/create', data).then((resF) => {
            if (typeof WeixinJSBridge === 'undefined') {
              this.$toast({
                message: '请使用微信内置浏览器进行支付',
              })
            } else {
              WeixinJSBridge.invoke(
                'getBrandWCPayRequest',
                {
                  appId: 'wx65dd7aa40a579725', // 公众号名称，由商户传入 //w xd6dceeee251fe0ad
                  timeStamp: resF.data.timeStamp, // 时间戳，自1970年以来的秒数
                  nonceStr: resF.data.nonceStr, // 随机串
                  package: resF.data.package,
                  signType: resF.data.signType, // 微信签名方式：
                  paySign: resF.data.paySign, // 微信签名
                },
                (res) => {
                  if (res.err_msg === 'get_brand_wcpay_request:ok') {
                    this.$router
                      .push({
                        name: 'company_clean_order',
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
        .catch()
    },
  },
  created() {
    if (!sessionStorage.getItem('token')) {
      sessionStorage.setItem('jump', 'company_clean')
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
.van-radio--horizontal {
  margin-bottom: 8px;
}
.form {
  padding-bottom: 30px;
  background-image: url('https://qjz.oss-cn-shenzhen.aliyuncs.com/images/company_bg.jpg');
  .nowPrice {
    font-size: 28px;
    color: #2d4f98;
    margin: 5px 0px;
    &::before {
      content: '¥';
      font-size: 16px;
      margin-right: 2px;
    }
  }
  .oldPrice {
    font-size: 14px;
    text-decoration: line-through;
    color: #666;
  }
  .form_tips {
    font-size: 12px;
    color: #666;
    text-align: left;
    margin-left: 16px;
    margin-top: 10px;
    &::before {
      content: '*';
      margin-right: 4px;
    }
  }
  .van-radio--horizontal {
    margin-bottom: 0;
  }
}
.form .form_container .member_combo .item {
  width: 30%;
}
// .form .form_container .member_combo .active {
//   background-color: rgb(45, 79, 152, 0.1);
// }
</style>
