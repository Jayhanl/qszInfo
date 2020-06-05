<template>
  <div class="demand">
    <div class="demand_container">
      <div class="demand_title">
        <p>会员权益</p>
      </div>
      <div class="member">
        <span>会员到期时间: 2021-6-04</span>
        <span>会员周免费服务剩余次数: {{dataD.vipServiceNum}}</span>
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
          label="需求类型"
          placeholder="点击需求类型"
          :rules="[{ required: true, message: '请选择需求类型' }]"
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
          <p>受理时间： 10:30 - 22:30</p>
          <p>收到您的请求后，我们会尽快派遣服务人员联系您</p>
        </div>
        <div class="btn ">
          <van-button round block type="info" native-type="submit" class="main">提交需求</van-button>
        </div>
      </van-form>
      <!-- <div class="btn">
        <van-button @click="callPhone()" plain round block type="info" class="service">联系客服</van-button>
      </div> -->
      <div class="service" @click="callPhone()">联系客服</div>
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
    text: '维修',
    id: 3,
    children: [
      {
        id: 31,
        text: '家电'
      },
      {
        id: 32,
        text: '卫生间'
      },
      {
        id: 33,
        text: '电脑网络'
      },
      {
        id: 33,
        text: '门锁、灯、一般五金'
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
        demand: '',
        orderService: '',
        orderNeed: '',
        orderExplain: ''
      },
      showDemand: false,
      columnsDemand: [
        {
          values: demand, // 设置的页面初始值
          className: 'column1'
        },
        {
          values: demand[0].children,
          className: 'column2'
        }
      ]
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
      this.form.demand = str.substring(1)
      this.showDemand = false
      this.form.orderNeed = result[0].id
      this.form.orderService = result[result.length - 1].text
      console.log(this.form.orderNeed)
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
        window.location.href = 'tel://' + '13112876805'
      })
    },
    onSubmit(values) {
      // if (this.dataD.vipServiceNum === 0) {
      //   this.$toast('您本周次数已使用，请下周再试')
      //   return
      // }
      Dialog.confirm({
        title: '提交需求',
        message: '提交后等待服务人员联系您'
      }).then(() => {
        let data = {
          orderExplain: this.form.orderExplain,
          orderService: this.form.orderService,
          orderNeed: this.form.orderNeed
        }
        axios.post('/order/create', data).then(res => {
          this.$toast.success('提交成功')
          this.form = {
            demand: '',
            orderService: '',
            orderNeed: '',
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
