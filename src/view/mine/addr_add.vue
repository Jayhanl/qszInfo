<template>
  <div class="addr_add">
    <navbar title="添加地址" />
    <van-form @submit="onAdd">
      <van-field
        v-model="form.contactName"
        label="姓名"
        maxlength="20"
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
      />
      <van-popup v-model="showArea" position="bottom">
        <van-area :area-list="areaList" @confirm="onConfirm" @cancel="showArea = false" />
      </van-popup>
      <van-field
        readonly
        clickable
        :value="form.plot.text"
        label="所在小区"
        placeholder="点击选择小区"
        :rules="[{ required: true, message: '请选择小区' }]"
        @click="onShowPlot"
      />
      <van-popup v-model="showPlot" position="bottom">
        <van-picker show-toolbar :columns="sqList" @confirm="onPlot" @cancel="showPlot = false" />
      </van-popup>
      <van-field
        v-if="form.plot.text==='其它'"
        v-model="form.housing"
        label="单位小区"
        maxlength="50"
        placeholder="如：x单位或小区"
        :rules="[{ required: true, message: '请填写单位小区名称' }]"
      />
      <van-field
        v-model="form.contactAddr"
        type="textarea"
        label="楼层单元"
        maxlength="100"
        placeholder="如：x栋x单元x房"
        :rules="[{ required: true, message: '请填写所在小区的楼层单元' }]"
      />
      <van-field
        v-model="form.remark"
        label="标签"
        maxlength="20"
        placeholder="方便您快速辨认地址"
        :rules="[{ required: true, message: '请填写标签' }]"
      />

      <div class="btn">
        <van-button round block type="info" native-type="submit">添加地址</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import axios from 'axios'
import area from '@/assets/js/area'
import navbar from '@/components/navbar.vue'

export default {
  name: 'addr_add',
  components: {
    navbar,
  },
  data() {
    return {
      areaList: area,
      showArea: false,
      showPlot: false,
      chosenAddressId: '1',
      dataList: [],
      sqList: {},
      form: {
        plot: {},
        area: [],
      },
    }
  },
  methods: {
    onConfirm(arr) {
      this.form.area = [arr[0].name, arr[1].name, arr[2].name]
      this.form.areaName = arr[0].name + ',' + arr[1].name + ',' + arr[2].name
      this.showArea = false
      this.getSq()
    },
    onPlot(e) {
      console.log(e)
      this.form.plot = e
      this.showPlot = false
    },
    onShowPlot() {
      console.log(this.form.area.length)
      if (this.form.area.length === 0) this.$toast('请先选择省市区')
      else this.showPlot = true
    },
    onAdd() {
      let addr =
        this.form.areaName +
        ',' +
        (this.form.plot.text === '其它'
          ? this.form.housing
          : this.form.plot.text) +
        ',' +
        this.form.contactAddr
      axios
        .post('/api/address/create', {
          contactName: this.form.contactName,
          contactMobile: this.form.contactMobile,
          housingId: this.form.plot.id,
          contactAddr: addr,
          remark: this.form.remark,
        })
        .then((res) => {
          this.$router
            .replace({
              name: 'addr_list',
            })
            .then(this.$toast.success('添加成功'))
        })
    },
    getData() {
      axios.get('/api/address/list').then((res) => {
        this.dataList = res.data
      })
    },
    getSq() {
      axios
        .get('/api/data/housing', {
          params: {
            province: this.form.area[0],
            city: this.form.area[1],
            county: this.form.area[2],
          },
        })
        .then((res) => {
          this.form.plot = {}
          this.sqList = res.data
        })
    },
  },
  created() {
    // document.title = '添加地址'
    // this.getData()
    // this.getSq()
  },
}
</script>

<style scoped lang="less">
.addr_add {
  // margin-top: 40px;
  .btn {
    margin-top: 20px;
    padding: 10px 20px 30px 20px;
  }

  .btn button {
    background-color: #ee0a24;
    border-color: #ee0a24;
  }

  .btn button::after {
    border: none;
  }
}
</style>
