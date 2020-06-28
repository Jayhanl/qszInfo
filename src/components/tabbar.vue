<template>
  <div>
    <van-tabbar z-index="999" route>
      <van-tabbar-item replace to="/demand" icon="manager-o">管家</van-tabbar-item>
      <van-tabbar-item replace to="/service" icon="orders-o">服务</van-tabbar-item>
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
