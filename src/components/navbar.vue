<template>
  <div>
    <van-nav-bar :title="title" left-text="返回" left-arrow @click-left="onClickLeft">
      <template v-if="collect" #right>
        <van-icon @click="onCollect()" :name="isCollect===1?'star':'star-o'" color="#FFC347" size="20" />
      </template>
    </van-nav-bar>
  </div>
</template>
<script>
export default {
  name: 'navbar',
  data() {
    return {}
  },
  props: {
    title: '',
    collect: {
      type: Boolean,
      default: false
    },
    isCollect: {
      type: Number,
      default: 0
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    onCollect() {
      this.$parent.onCollect()
    }
  }
}
</script>
<style scoped>
</style>
