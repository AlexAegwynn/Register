<template>
  <view class="app-main">
    <navbar bg-color="#ffa45d">
      <view slot="center" class="tabbar">信息登记系统</view>
    </navbar>
    <view class="app-login">
      <view class="title">用户登录</view>
      <view style="margin-bottom: 10px;">
        <u-input v-model="data.LoginId" placeholder="请填写账号"></u-input>
      </view>
      <view>
        <u-input type="password" v-model="data.Pwd" placeholder="请填写密码"></u-input>
      </view>
      <view class="login-btn">
        <span @click="login">登录</span>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    onLoad() {
      if (uni.getStorageSync("LoginId")) {
        this.data.LoginId = uni.getStorageSync("LoginId");
        this.data.Pwd = uni.getStorageSync("Pwd");
        // this.login();
      }
    },
    data() {
      return {
        api: require("@/api/login/login").default,
        data: {
          LoginId: "",
          Pwd: "",
        },
        loading: false,
      }
    },
    methods: {
      login() {
        // uni.redirectTo({
        //   url: '/pages/index/index'
        // });
        // return;

        if (!this.data.LoginId) {
          uni.showToast({
            title: "请填写账号",
            icon: "none"
          })
          return false;
        }
        if (!this.data.Pwd) {
          uni.showToast({
            title: "请填写密码",
            icon: "none"
          })
          return false;
        }
        uni.showLoading({
          title: "加载中"
        });

        var select_sql = "SELECT * FROM SY_User ";
        select_sql += "WHERE LoginId = '" + this.data.LoginId + "' AND Pwd = '" + this.data.Pwd + "'";

        this.$sqlite.select(select_sql).then(res => {
          uni.hideLoading();
          if (res.length != 0) {
            var user = res[0];
            // console.log('user', user);
            console.log('登录成功', user);
            uni.setStorageSync("LoginId", user.LoginId);
            uni.setStorageSync("Pwd", user.Pwd);
            uni.redirectTo({
              url: '/pages/index/index'
            });
          } else {
            uni.showToast({
              title: "账号密码不正确",
              icon: "none"
            })
            uni.removeStorageSync("LoginId");
            uni.removeStorageSync("Pwd");
          }
        }).catch(err => {
          console.log('err', err)
          uni.hideLoading();
          uni.showToast({
            title: "登录失败",
            icon: "none"
          })
          uni.removeStorageSync("LoginId");
          uni.removeStorageSync("Pwd");
        });
      },
    }
  }
</script>
<style lang="scss">
  .app-login {
    width: 80%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -70%);

    .title {
      font-size: 22px;
      display: inline-block;
      width: 100%;
      text-align: center;
      line-height: 40px;
      color: #FF9933;
      margin-bottom: 22px;
    }

    .login-btn {
      padding: 1.5rem 10%;

      span {
        display: block;
        height: 3.6rem;
        line-height: 3.6rem;
        color: #fff;
        text-align: center;
        border-radius: 1.8rem;
        font-size: 1.5rem;
        font-weight: bold;
        background: linear-gradient(90deg, #ffb961 0%, #ff8960 100%);
      }
    }
  }
</style>
