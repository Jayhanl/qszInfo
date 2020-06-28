<template>
  <div class="addr_container">
    <!-- <div class="page">
      <div class="address-list" v-for="item in dataList" :key="item.id">
        <div class="address-item">
          <div class="address-name">
            {{item.contactName}}
          </div>
          <div class="address-info">
            <div>
              <span class="surname">{{item.contactName}}</span>
              <span class="phone">{{item.contactMobile}}</span>
              <div class="address-item-img">
                <van-icon name="edit" />
              </div>
            </div>
            <span class="address-addr">{{item.contactAddr}}</span>
          </div>
        </div>
      </div>
      <div class="add" hover-class="none">
        <van-icon class="img" name="add-o" />
        <span>新增收获地址</span>
      </div>
    </div>-->
    <van-address-list
      v-model="chosenAddressId"
      :switchable="isChoice"
      @select="onSelect"
      :list="dataList"
      @add="onAdd"
      @edit="onEdit"
    />
  </div>
</template>

<script>
import { Dialog } from 'vant'
import axios from 'axios'

export default {
  name: 'addr',
  components: {},
  data() {
    return {
      url: '',
      isChoice: false,
      chosenAddressId: '1',
      dataList: []
    }
  },
  methods: {
    onAdd() {
      this.$router.push({
        name: 'addr_add'
      })
    },
    onEdit(item) {
      this.$router.push({
        name: 'addr_edit',
        params: {
          item
        }
      })
    },
    onSelect(item) {
      console.log(item)
      Dialog.confirm({
        title: '选择地址',
        message: '是否确认选择该地址'
      })
        .then(() => {
          console.log(this.url)
          this.$router.replace({
            name: this.url,
            params: {
              item
            }
          })
          sessionStorage.removeItem('addrChoice')
        })
        .catch(() => {})
    },
    getData() {
      axios.get('/api/address/list').then(res => {
        res.data.map(item => {
          let tag = '标签：' + item.remark + '\n'
          item.address = tag + item.address
          return item
        })
        this.dataList = res.data
      })
    }
  },
  created() {
    // if (this.$route.params.isChoice) {
    //   this.url = this.$route.params.url
    //   this.isChoice = true
    // }
    if (sessionStorage.getItem('addrChoice')) {
      this.url = sessionStorage.getItem('addrChoice')
      this.isChoice = true
    }
    document.title = '我的地址'
    this.getData()
  }
}
</script>

<style scoped lang="less">
// @import url('../../assets/css/addr.less');
.addr_container {
  background-color: #f7f8fa;
  min-height: 100vh;
}
.van-address-item__address {
  white-space: pre;
}
</style>
