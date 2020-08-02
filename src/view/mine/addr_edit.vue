<template>
  <div class="addr_add">
    <navbar title="编辑地址" />
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
      <!-- <van-field
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
        :value="form.plot"
        label="小区"
        placeholder="点击选择小区"
        :rules="[{ required: true, message: '请选择小区' }]"
        @click="showPlot = true"
      />
      <van-popup v-model="showPlot" position="bottom">
        <van-picker
          show-toolbar
          :columns="columnsPlot"
          @confirm="onPlot"
          @cancel="showPlot = false"
        />
      </van-popup>-->
      <van-field
        v-model="form.contactAddr"
        readonly
        type="textarea"
        label="详细地址"
        maxlength="100"
      />
      <van-field
        v-model="form.remark"
        label="标签"
        maxlength="100"
        placeholder="方便您快速辨认地址"
        :rules="[{ required: true, message: '请填写标签' }]"
      />
      <div class="tips">详细地址无法修改</div>
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
import navbar from '@/components/navbar.vue'

export default {
  name: 'addr_edit',
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
      sqList: [],
      form: {},
    }
  },
  methods: {
    onConfirm(arr) {
      this.form.area = arr[0].name + ',' + arr[1].name + ',' + arr[2].name
      console.log(arr)
      this.showArea = false
    },
    onPlot(e) {
      this.form.plot = e
      this.showPlot = false
    },
    onEdit() {
      axios
        .put('/api/address/update', {
          addressId: this.form.addressId,
          contactName: this.form.contactName,
          contactMobile: this.form.contactMobile,
          contactAddr: this.form.contactAddr,
          remark: this.form.remark,
        })
        .then((res) => {
          this.$router
            .replace({
              name: 'addr_list',
            })
            .then(this.$toast.success('编辑成功'))
        })
    },
    onDel() {
      this.$dialog.confirm({
        title: '地址删除',
        message: '确认要删除该地址吗',
      }).then(() => {
        axios
          .delete('/api/address/delete', {
            params: {
              addressId: this.form.addressId,
            },
          })
          .then((res) => {
            this.$router
              .replace({
                name: 'addr_list',
              })
              .then(this.$toast.success('删除成功'))
          })
      })
    },
  },
  created() {
    let item = this.$route.params.item
    if (item) {
      this.form = item
      // let ind = item.contactAddr.lastIndexOf(',')
      // let ind2 = item.contactAddr.lastIndexOf(',',ind-1)
      // this.form.area = item.contactAddr.substring(0, ind2)
      // this.form.plot = item.contactAddr.substring(ind2+1, ind)
      // this.form.contactAddr = item.contactAddr.substring(ind + 1)
      console.log(this.form)
      // document.title = '编辑地址'
    } else {
      this.$router
        .replace({
          name: 'addr_list',
        })
        .then(() => {
          this.$toast('请重新选择地址')
        })
    }
  },
}
</script>

<style scoped lang="less">
.addr_add {
  // margin-top: 40px;
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
  .tips {
    color: #656565;
    margin-left: 16px;
    font-size: 12px;
    &::before {
      content: '*';
      margin-right: 4px;
      color: #f40;
    }
  }
}
</style>
