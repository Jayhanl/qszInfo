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
        @click="showPlot = true"
      />
      <van-popup v-model="showPlot" position="bottom">
        <van-picker show-toolbar :columns="sqList" @confirm="onPlot" @cancel="showPlot = false" />
      </van-popup>
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
        maxlength="100"
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
      },
      columnsPlot: ['珠江帝景', '鸿景花园', '泊雅湾', '利安花园'],
    }
  },
  methods: {
    onConfirm(arr) {
      this.form.area = arr[0].name + ',' + arr[1].name + ',' + arr[2].name
      console.log(arr)
      this.showArea = false
    },
    onPlot(e) {
      console.log(e)
      this.form.plot = e
      this.showPlot = false
    },
    onAdd() {
      axios
        .post('/api/address/create', {
          contactName: this.form.contactName,
          contactMobile: this.form.contactMobile,
          lng: this.form.plot.lng,
          lat: this.form.plot.lat,
          contactAddr:
            this.form.area +
            ',' +
            this.form.plot.text +
            ',' +
            this.form.contactAddr,
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
            province: '广东省',
            city: '广州市',
            county: '海珠区',
          },
        })
        .then((res) => {
          this.sqList = res.data
        })
    },
  },
  created() {
    // document.title = '添加地址'
    // this.getData()
    this.getSq()
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
