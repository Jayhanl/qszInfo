<template>
  <div class="addr_add">
    <van-form @submit="onEdit">
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

      <div class="btn_list">
        <van-button round block type="info" native-type="submit" class="edit">编辑地址</van-button>
        <van-button
          round
          plain
          block
          type="info"
          native-type="button"
          @click="onDel"
          class="del"
        >删除地址</van-button>
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
    onEdit() {
      axios
        .put('/api/address/update', {
          addressId: this.form.addressId,
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
            .then(this.$toast.success('编辑成功'))
        })
    },
    onDel() {
      axios
        .delete('/api/address/delete', {
          params: {
            addressId: this.form.addressId
          }
        })
        .then(res => {
          this.$router
            .replace({
              name: 'addr_list'
            })
            .then(this.$toast.success('删除成功'))
        })
    }
  },
  created() {
    let item = this.$route.params.item
    if (item) {
      this.form = item
      let ind = item.contactAddr.lastIndexOf(',')
      this.form.addr = item.contactAddr.substring(0, ind)
      this.form.contactAddr = item.contactAddr.substring(ind + 1)
      console.log(this.form.contactAddr)
      document.title = '编辑地址'
    } else {
      this.$router
        .replace({
          name: 'addr_list'
        })
        .then(() => {
          this.$toast('请重新选择地址')
        })
    }
  }
}
</script>

<style scoped lang="less">
.addr_add {
  margin-top: 40px;
  .btn_list {
    margin-top: 20px;
    padding: 10px 20px 30px 20px;

    .edit {
      background-color: #ee0a24;
      border-color: #ee0a24;
    }
    .del {
      border-color: #656565;
      color: #656565;
    }
    button {
      margin: 12px 0;
    }
    button::after {
      border: none;
    }
  }
}
</style>
