<style lang="less">
@import "./login.less";
</style>

<template>
  <div class="login">
    <div class="login-con">
      <div class="login-con-header">
        <div class="login-con-header-left">
          <div class="login-con-header-left-image" />
          <div>绿航物联</div>
        </div>
        <div style="color: black">|</div>
        <div class="login-con-header-right">云平台管理</div>
      </div>
      <div class="form-con">
        <login-form @on-success-valid="handleSubmit"></login-form>
        <!-- <p class="login-tip">输入任意用户名和密码即可</p> -->
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from "_c/login-form";
import { mapActions } from "vuex";
import { getSystemHomeName } from "@/libs/util";
import maxLogo from "@/assets/images/lhiot_logo.jpg";

export default {
  components: {
    LoginForm
  },
  data() {
    return {
      maxLogo,
      logo:
        'this.src="' +
        require("../../../src/assets/images/lhiot_logo.jpg") +
        '"'
    };
  },
  methods: {
    ...mapActions(["handleLogin", "getUserInfo"]),
    handleSubmit({ account, password }) {
      this.handleLogin({ account, password }).then(res => {
        sessionStorage.setItem("loginName", account);
        const name = getSystemHomeName();
        console.log("homeName after login:", name);
        this.$router.push({
          name
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
/*.login /deep/ */
.login-con {
  width: 580px;
  height: 620px;
  min-height: 290px;
  min-width: 310px;
  box-shadow: 0px 16px 32px 0px rgba(81, 114, 255, 0.5);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.7);
}
</style>
