<template>
  <div class="addr_add">
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
        :value="form.addr"
        label="省市区"
        placeholder="点击选择省市区"
        @click="showArea = true"
      />
      <van-popup v-model="showArea" position="bottom">
        <van-area :area-list="areaList" @confirm="onConfirm" @cancel="showArea = false" />
      </van-popup>
      <van-field
        v-model="form.contactAddr"
        type="textarea"
        label="详细地址"
        maxlength="100"
        placeholder="请输入详细地址"
        :rules="[{ required: true, message: '请填写详细地址' }]"
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

export default {
  name: 'addr',
  components: {},
  data() {
    return {
      areaList: area,
      showArea: false,
      chosenAddressId: '1',
      dataList: [],
      form: {}
    }
  },
  methods: {
    onConfirm(arr) {
      this.form.addr = arr[0].name + ',' + arr[1].name + ',' + arr[2].name
      console.log(arr)
      this.showArea = false
    },
    onDelete() {
      this.$toast('delete')
    },
    onChangeDetail(val) {
      if (val) {
        this.searchResult = [
          {
            name: '黄龙万科中心',
            address: '杭州市西湖区'
          }
        ]
      } else {
        this.searchResult = []
      }
    },
    onAdd() {
      axios
        .post('/api/address/create', {
          contactName: this.form.contactName,
          contactMobile: this.form.contactMobile,
          contactAddr: this.form.addr + ',' + this.form.contactAddr,
          remark: this.form.remark
        })
        .then(res => {
          this.$router
            .replace({
              name: 'addr_list'
            })
            .then(this.$toast.success('添加成功'))
        })
    },
    getData() {
      axios.get('/api/address/list').then(res => {
        this.dataList = res.data
      })
    }
  },
  created() {
    document.title = '添加地址'
    // this.getData()
  }
}
</script>

<style scoped lang="less">
.addr_add {
  margin-top: 40px;
  .btn {
    margin-top: 20px;
    padding: 10px 20px 30px 20px;
  }

  .btn button {
    background-color: #EE0A24;
    border-color: #EE0A24;
  }

  .btn button::after {
    border: none;
  }
}
</style>
