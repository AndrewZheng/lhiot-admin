<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card :bordered="false" icon="log-in" title="欢迎登录">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <!-- <p class="login-tip">输入任意用户名和密码即可</p> -->
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form';
import { mapActions } from 'vuex';
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit({ account, password }) {
      this.handleLogin({ account, password }).then(res => {
        this.$router.push({
          name: 'home'
        });
      });
    }
  }
};
</script>

<style>

</style>
