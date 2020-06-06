<template>
  <div class="demand">
    <div class="demand_container">
      <div class="demand_title">
        <p>会员权益</p>
      </div>
      <div class="member">
        <span>会员到期时间: {{dataD.vipPastTime}}</span>
        <span>会员赠送服务剩余次数: {{dataD.vipServiceNum}}</span>
        <span>会员日免费服务剩余次数: {{dataD.vipFreeServiceNum}}</span>
      </div>
    </div>
    <div class="demand_container demand_form">
      <div class="demand_title">
        <p>发布需求</p>
      </div>
      <van-form @submit="onSubmit">
        <van-field
          readonly
          clickable
          name="picker"
          :value="form.orderService"
          label="服务1"
          placeholder="点击选择服务1"
          :rules="[{ required: true, message: '请选择服务1' }]"
          @click="showDemand = true"
        />
        <van-popup v-model="showDemand" position="bottom">
          <van-picker
            show-toolbar
            :columns="columnsDemand"
            @confirm="onConfirm"
            @cancel="showDemand = false"
            @change="onChange"
          />
        </van-popup>
        <van-field
          readonly
          v-if="form.orderService"
          clickable
          name="picker"
          :value="form.orderService1"
          label="服务2"
          placeholder="点击选择服务2"
          @click="showDemand1 = true"
        />
        <van-popup v-model="showDemand1" position="bottom">
          <van-picker
            show-toolbar
            :columns="columnsDemand1"
            @confirm="onConfirm1"
            @cancel="showDemand1 = false"
            @change="onChange1"
          />
        </van-popup>
        <van-field
          v-model="form.orderExplain"
          rows="3"
          autosize
          label="详细说明"
          type="textarea"
          maxlength="300"
          placeholder="请输入详细说明..."
          show-word-limit
          :rules="[{ required: true, message: '请输入详细说明' }]"
        />
        <div class="tips">
          <!-- <p>受理时间： 10:30 - 22:30</p> -->
          <p>收到您的请求后，我们会尽快派遣服务人员联系您</p>
        </div>
        <div class="btn ">
          <van-button round block type="info" native-type="submit" class="main">提交需求</van-button>
        </div>
      </van-form>
      <!-- <div class="btn">
        <van-button @click="callPhone()" plain round block type="info" class="service">联系客服</van-button>
      </div> -->
      <div class="service">
        <span @click="callPhone()">联系客服</span>
      </div>
    </div>
    <br />
  </div>
</template>

<script>
import { Dialog } from 'vant'
import axios from 'axios'
import config from 'config'
import qs from 'qs'
const demand = [
  // 我们习惯的格式。 可以后台给你出，如果你打不过的话，你就。。。
  {
    text: '会员赠送服务', // 默认识别text标签
    id: 1,
    children: [
      {
        id: 11,
        text: '一小时清洁打扫服务'
      },
      {
        id: 12,
        text: '上门洗车服务'
      },
      {
        id: 13,
        text: '床上用品除螨服务'
      }
    ]
  },
  {
    text: '搬运',
    id: 2,
    children: [
      {
        id: 21,
        text: '家具拆装'
      },
      {
        id: 22,
        text: '家具转移'
      }
    ]
  },
  {
    text: '照明',
    id: 3,
    children: [
      {
        id: 31,
        text: '灯泡'
      },
      {
        id: 32,
        text: '灯管'
      },
      {
        id: 33,
        text: '一般五金'
      },
      {
        id: 34,
        text: '维护拆装'
      }
    ]
  },
  {
    text: '卫生间',
    id: 4,
    children: [
      {
        id: 41,
        text: '通厕除臭'
      },
      {
        id: 42,
        text: '地漏疏通'
      },
      {
        id: 43,
        text: '蹲便疏通'
      },
      {
        id: 44,
        text: '马桶疏通'
      },
      {
        id: 45,
        text: '水龙头疏通'
      }
    ]
  },
  {
    text: '电脑网络',
    id: 5,
    children: [
      {
        id: 51,
        text: '软件硬件'
      },
      {
        id: 52,
        text: '系统修复'
      },
      {
        id: 53,
        text: '路由器'
      },
      {
        id: 54,
        text: '网络修复'
      }
    ]
  }
]
export default {
  name: 'formCreate',
  data() {
    return {
      dataD: {},
      form: {
        orderNeed: '',
        orderService: '',
        orderNeed1: 0,
        orderService1: '',
        orderExplain: ''
      },
      showDemand: false,
      showDemand1: false,
      columnsDemand: [
        {
          values: demand, // 设置的页面初始值
          className: 'column1'
        },
        {
          values: demand[0].children,
          className: 'column2'
        }
      ],
      columnsDemand1: [
        {
          values: demand, // 设置的页面初始值
          className: 'column1'
        },
        {
          values: demand[0].children,
          className: 'column2'
        }
      ],
    }
  },
  methods: {
    onConfirm(value) {
      const compact = arr => arr.filter(Boolean) // 三级联动 去除没值的，比如只有两级
      const result = compact(value)
      let str = '' // 呈现页面显示  /xxx/xxx/xxx
      result.forEach(item => {
        str += '/' + item.text
      })
      this.showDemand = false
      this.form.orderNeed = result[0].id
      this.form.orderService = result[result.length - 1].text
      console.log(this.form.orderNeed)
    },
    onChange1(picker, values, index) {
      let ColumnIndex = picker.getColumnIndex(index)
      console.log('第' + index + '列', '第' + ColumnIndex + '个')
      if (index === 0)
        picker.setColumnValues(1, demand[ColumnIndex].children || []) //点当前列更新下一列数据，防止undefined
    },
    onConfirm1(value) {
      const compact = arr => arr.filter(Boolean) // 三级联动 去除没值的，比如只有两级
      const result = compact(value)
      let str = '' // 呈现页面显示  /xxx/xxx/xxx
      result.forEach(item => {
        str += '/' + item.text
      })
      this.showDemand1 = false
      this.form.orderNeed1 = result[0].id
      this.form.orderService1 = result[result.length - 1].text
      console.log(this.form.orderNeed1)
    },
    onChange(picker, values, index) {
      let ColumnIndex = picker.getColumnIndex(index)
      console.log('第' + index + '列', '第' + ColumnIndex + '个')
      if (index === 0)
        picker.setColumnValues(1, demand[ColumnIndex].children || []) //点当前列更新下一列数据，防止undefined
    },
    callPhone() {
      Dialog.confirm({
        title: '联系客服',
        message: '是否确认拨打电话'
      }).then(() => {
        window.location.href = 'tel://' + '80923416'
      })
    },
    onSubmit() {
      console.log(this.form)
      if(this.dataD.vipServiceNum===0&&(this.form.orderNeed===1||this.form.orderNeed1===1)){
        this.$toast('本周会员赠送次数已用完,欢迎您下周再次使用~')
        return
      }
      if(this.form.orderNeed===1&&this.form.orderNeed1===1) {
        this.$toast('不能同时选择两项会员赠送服务~')
        return
      }
      if((this.form.orderNeed===this.form.orderNeed1)&&(this.form.orderService === this.form.orderService1)) {
        this.$toast('您选择了两项重复的服务~')
        return
      }
      let serviceNum = 0
      console.log(serviceNum);
      if(this.form.orderNeed!==1)serviceNum++
      if(this.form.orderNeed1!==1&&this.form.orderNeed1!==0)serviceNum++
      console.log(serviceNum);
      let msg = '提交后等待服务人员联系您'
      if(this.form.orderNeed===2||this.form.orderNeed1===2){
        msg = '搬运服务需收费，'+ msg
      }else if(this.dataD.vipFreeServiceNum<1&&this.form.orderNeed!==1){
        msg = '您的免费次数不足，本次订单将会收费'+ msg
      }else if(this.dataD.vipFreeServiceNum<serviceNum){
        msg = '您的免费次数不足，本次订单将会收费'+ msg
      }
      Dialog.confirm({
        title: '提交需求',
        message: msg
      }).then(() => {
        let data = {
          orderNeed: this.form.orderNeed,
          orderService: this.form.orderService,
          orderNeedSec: this.form.orderNeed1||0,
          orderServiceSec: this.form.orderService1,
          orderExplain: this.form.orderExplain,
        }
        axios.post('/order/create', data).then(res => {
          this.$toast.success('提交成功')
          this.form = {
            demand: '',
            orderNeed: 0,
            orderService: '',
            orderNeed1: 0,
            orderService1: '',
            orderExplain: ''
          }
          this.getData()
        })
      })
    },
    getData() {
      axios.get('/user/get').then(res => {
        console.log(res.data)
        this.dataD = res.data
      })
    }
  },
  created() {
    this.getData()
  }
}
</script>

<style scoped lang="less">
@import url('../assets/css/demand.less');
</style>
