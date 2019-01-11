<template>
  <div class="login-form">
    <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
      <FormItem prop="account">
        <Input size="large" v-model="form.account" placeholder="请输入用户名">
        <span slot="prepend">
          <!--<Icon :size="35" type="ios-person"></Icon>-->
          <img src="../../../src/assets/images/zhanghao.png">
        </span>
        </Input>
      </FormItem>
      <FormItem prop="password">
        <Input v-show="false" prefix="ios-contact" placeholder="Enter name" style="width: auto" />
        <Input size="large" v-model="form.password" type="password" placeholder="请输入密码">
        <span slot="prepend">
          <img src="../../../src/assets/images/mima.png">
        </span>
        </Input>
      </FormItem>
      <!--<div class="remember_password">-->
        <!--<img src="../../../src/assets/images/check_able.png"><a>记住我</a>-->
      <!--</div>-->
      <FormItem>
        <Button type="primary" long @click="handleSubmit">登录</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
export default {
  name: 'LoginForm',
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ];
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ];
      }
    }
  },
  data() {
    return {
      form: {
        account: 'admin',
        password: ''
      }
    };
  },
  computed: {
    rules() {
      return {
        account: this.userNameRules,
        password: this.passwordRules
      };
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', {
            account: this.form.account,
            password: this.form.password
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.login-form /deep/ .ivu-btn-primary{
  margin-top: 44px;
  width: 500px;
  height: 89px;
  background-color: #5172ff;
  box-shadow: 0px 18px 49px 0px
  rgba(13, 95, 26, 0.21);
  border-radius: 20px;
  span {
    width: 61px;
    height: 31px;
    font-family: PingFangSC-Medium;
    font-size: 32px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #ffffff;
  }
};
.login-form /deep/ .ivu-input:last-child{
  height: 90px;
  border-radius: 20px;
  background: white !important;
  border: 0;
}
.login-form /deep/ .ivu-input-group-prepend{
  border-radius: 20px;
  width: 66px;
  background-color: white;
  border:0px;
}
.login-form /deep/ .ivu-input-group-large{
  font-size: 14px;
  border-radius: 20px;
  box-shadow: 0px 10px 30px 0px
  rgba(21, 21, 21, 0.1);
}
.remember_password{
  display: flex;
  align-items: center;
  margin-top: 55px;
  img {
    margin-left: 28px;
  }
  a {
    display: inline-block;
    margin-left: 10px;
    font-size: 28px;
  }
}
</style>
