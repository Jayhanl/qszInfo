<template>
  <div class="iframe_cont">
    <img class="logo" src="https://qjz.oss-cn-shenzhen.aliyuncs.com/images/sjLogo.png" />
    <p>功能升级中，敬请期待~</p>
    <!-- <iframe src="https://maintain.zhiwei99.com" width="100%" height="100%"></iframe> -->
    <tabBar />
  </div>
</template>

<script>
import tabBar from '@/components/tabbar.vue'
export default {
  name: 'demand',
  components: {
    tabBar
  },
  data() {
    return {}
  },
  methods: {},
  created() {
    document.title = '市井&轻家政'
  }
}
</script>

<style scoped lang="less">
.iframe_cont {
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .logo {
    width: 150px;
    height: 150px;
  }
}
</style>
