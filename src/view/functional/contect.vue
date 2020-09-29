<template>
  <div class="form">
    <navbar title="联系我们" />
    <img class="logo" src="https://qjz.oss-cn-shenzhen.aliyuncs.com/images/logo.png" />
    <div class="form_container">
      <div class="form_title">
        <p>留言建议</p>
      </div>
      <van-form @submit="onSubmit">
        <van-field
          v-model="title"
          label="标题"
          maxlength="10"
          placeholder="请输入标题"
          :rules="[{ required: true, message: '请填写标题' }]"
        />
        <van-field
          v-model="content"
          rows="3"
          autosize
          label="留言建议"
          type="textarea"
          placeholder="请输入留言建议"
          :rules="[{ required: true, message: '请填写留言建议' }]"
        />
        <div class="btnRow">
          <!-- <van-button class="cancel" round native-type="button" @click="onCancel">商业合作</van-button> -->
          <van-button class="confirm" round type="info" native-type="submit">提交留言</van-button>
        </div>
      </van-form>
      <!-- <div class="form_title">
        <p>商业合作</p>
      </div>
      <van-image
        fit
        class="contect_code"
        width="200"
        height="240"
        src="https://qjz.oss-cn-shenzhen.aliyuncs.com/images/contect_code.jpg"
        @click="onShowImg()"
      />
      <div class="form_tips">点击图片识别二维码，加客服微信进行商业合作咨询</div> -->
    </div>
    <br />
  </div>
</template>

<script>
import axios from 'axios'
import navbar from '@/components/navbar.vue'
import { ImagePreview } from 'vant'
export default {
  name: 'contect',
  components: {
    navbar,
  },
  data() {
    return {
      title: '',
      content: '',
    }
  },
  methods: {
    onShowImg(e) {
      ImagePreview([
        'https://qjz.oss-cn-shenzhen.aliyuncs.com/images/contect_code.jpg',
      ])
    },

    onSubmit(values) {
      let that = this
      this.$dialog
        .confirm({
          title: '留言建议',
          message: '请是否确认提交留言建议',
        })
        .then(() => {
          axios
            .post('/api/user/complain', {
              title: that.title,
              content: that.content,
            })
            .then((resF) => {
              that.title = ''
              that.content = ''
              this.$toast('感谢您宝贵的建议，我们会继续努力的~')
            })
        })
        .catch()
    },
  },
  created() {
    if (!sessionStorage.getItem('token')) {
      sessionStorage.setItem('jump', 'contect')
      this.$router.replace({
        name: 'index',
      })
      return
    }
  },
}
</script>

<style scoped lang="less">
@import url('../../assets/css/form.less');
.form {
  .form_container .form_title {
    margin: 20px 0;
  }
  .contect_code {
    // margin: 20px 0;
  }
  .form_tips {
    font-size: 12px;
    color: #666;
    // text-align: left;
    // margin-left: 16px;
    // margin-top: 10px;
    padding-bottom: 20px;
    &::before {
      content: '*';
      margin-right: 4px;
    }
  }
}
</style>
