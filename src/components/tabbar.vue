<template>
  <div>
    <van-tabbar z-index="999" route>
      <!-- <van-tabbar-item replace to="/shop" icon="gift-o">优惠活动</van-tabbar-item> -->
      <van-tabbar-item replace to="/company_clean" icon="desktop-o">办公保洁</van-tabbar-item>
      <van-tabbar-item replace to="/service" icon="orders-o">家政服务</van-tabbar-item>
      <van-tabbar-item replace to="/nurse" icon="manager-o">钟点保姆</van-tabbar-item>
      <van-tabbar-item replace to="/mine" icon="user-circle-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
  export default {
    name: "tabbar",
    data() {
      return {};
    },
    methods: {},
    computed: {
    }
  };

</script>
<style scoped>
.van-tabbar-item--active {
    color: #2d4f98;
}
</style>
