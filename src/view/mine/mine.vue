<template>
  <div class="mine_contanier margin-bottom">
    <div class="me">
      <div class="userinfo">
        <div class="userinfo_avatar">
          <van-image
            round
            fit="cover"
            width="100%"
            height="100%"
            src="https://qjz.oss-cn-shenzhen.aliyuncs.com/images/logo-min.png"
          />
        </div>
        <div class="userinfo_grade">
          <!-- <van-tag v-if="userInfo.vip_code" type="warning">VIP</van-tag> -->
          <span>{{userInfo.mobile||'轻家政'}}</span>
        </div>
        <!-- <router-link :to="{name:'tips',params:{free:userInfo.free_num}}" class="tips_img">
          <van-icon color="#fff" size="24" name="question-o" />
        </router-link>-->
      </div>
      <div class="animation-wave">
        <div class="wave"></div>
      </div>
    </div>

    <div class="mine_order">
      <van-cell title="服务订单" icon="logistics" is-link @click="goOrder" />
      <div class="list">
        <!-- <router-link :to="{name:'order',params:{status:'0'}}" class="detail">
          <van-icon size="30" style="padding: 8px;" color="#2d4f98" name="balance-list-o" />
          <span>未付款</span>
        </router-link>-->
        <router-link :to="{name:'order',params:{status:0}}" class="detail">
          <van-icon size="30" style="padding: 8px;" color="#2d4f98" name="todo-list-o" />
          <span>进行中</span>
        </router-link>
        <router-link :to="{name:'order',params:{status:1}}" class="detail">
          <van-icon size="30" style="padding: 8px;" color="#2d4f98" name="completed" />
          <span>已完成</span>
        </router-link>
        <!-- <router-link :to="{name:'order',params:{status:'-2'}}" class="detail">
          <van-icon size="30" style="padding: 8px;" color="#2d4f98" name="after-sale" />
          <span>退款中</span>
        </router-link>-->
      </div>
    </div>
    <router-link :to="{name:'scan'}" class="active_container">
      <van-icon size="23" style="margin: auto 20px;" color="#2d4f98" name="qr" />
      <div class="active_text">
        <span>扫码送礼</span>
        <span class="active_text_english">Sweep Yards Gifts</span>
      </div>
      <div class="active_triangle"></div>
    </router-link>


    <router-link :to="{name:'company_clean_order'}" class="active_container">
      <van-icon size="23" style="margin: auto 20px;" color="#2d4f98" name="desktop-o" />
      <div class="active_text">
        <span>办公保洁订单</span>
        <span class="active_text_english">Office Cleaning Order</span>
      </div>
      <div class="active_triangle"></div>
    </router-link>

    <div @click="goAddr" class="active_container">
      <van-icon size="23" style="margin: auto 20px;" color="#2d4f98" name="setting-o" />
      <div class="active_text">
        <span>我的地址</span>
        <span class="active_text_english">My Address</span>
      </div>
      <div class="active_triangle"></div>
    </div>

    <router-link :to="{name:'coupon'}" class="active_container">
      <van-icon size="23" style="margin: auto 20px;" color="#2d4f98" name="coupon-o" />
      <div class="active_text">
        <span>我的优惠券</span>
        <span class="active_text_english">My Coupon</span>
      </div>
      <div class="active_triangle"></div>
    </router-link>

    <router-link :to="{name:'coupon_order'}" class="active_container">
      <van-icon size="23" style="margin: auto 20px;" color="#2d4f98" name="discount" />
      <div class="active_text">
        <span>优惠券订单</span>
        <span class="active_text_english">Coupon Order</span>
      </div>
      <div class="active_triangle"></div>
    </router-link>

    <router-link :to="{name:'code'}" class="active_container">
      <van-icon size="23" style="margin: auto 20px;" color="#2d4f98" name="qr" />
      <div class="active_text">
        <span>我的二维码</span>
        <span class="active_text_english">My Qr Code</span>
      </div>
      <div class="active_triangle"></div>
    </router-link>
    
    <!-- <router-link :to="{name:'mask_order'}" class="active_container">
      <van-icon size="23" style="margin: auto 20px;" color="#2d4f98" name="description" />
      <div class="active_text">
        <span>口罩订单</span>
        <span class="active_text_english">Mask Order</span>
      </div>
      <div class="active_triangle"></div>
    </router-link> -->
    
    <router-link :to="{name:'contect'}" class="active_container">
      <van-icon size="23" style="margin: auto 20px;" color="#2d4f98" name="phone-o" />
      <div class="active_text">
        <span>联系我们</span>
        <span class="active_text_english">Connect Us</span>
      </div>
      <div class="active_triangle"></div>
    </router-link>
    <br />
    <tabBar></tabBar>
  </div>
</template>

<script>
import axios from 'axios'
import config from 'config'
import tabBar from '@/components/tabbar.vue'
export default {
  name: 'mine',
  components: {
    tabBar,
  },
  data() {
    return {
      userInfo: {},
    }
  },
  methods: {
    goOrder() {
      this.$router.push({
        name: `order`,
        params: {
          status: 1,
        },
      })
    },
    goAddr() {
      this.$router.push({
        name: `addr_list`,
      })
      sessionStorage.removeItem('addrChoice')
    },
    getData() {
      axios.get('/api/user/get').then((res) => {
        // sessionStorage.setItem('free_num', res.data.free_num)
        res.data.contactMobile =
          res.data.contactMobile.substr(0, 3) +
          '****' +
          res.data.contactMobile.substr(7)
        this.userInfo = res.data
      })
    },
  },
  created() {
    if (!sessionStorage.getItem('token')) {
      sessionStorage.setItem('jump', 'mine')
      this.$router.replace({
        name: 'index',
      })
      return
    }
    this.getData()
    document.title = '市井&轻家政'
  },
}
</script>

<style scoped lang="less">
@import url('../../assets/css/mine.less');
</style>
