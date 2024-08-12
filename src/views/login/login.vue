<template>
  <div id="login">
    <div class="login-content">
      <div class="login-logo">
        <img src="@/assets/ecs-logo.png" class="h-20 mr-6" />
        <div class="login-logo-content">
          <h4 class="font-bold">出货单据打印系统</h4>
          <span>Express Document Printing System</span>
        </div>
      </div>
      <a-form layout="vertical">
        <a-form-item label="账号">
          <a-input placeholder="请输入账号" v-model:value="account">
            <template #prefix>
              <i class="ri-user-line"></i>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="密码">
          <a-input-password placeholder="请输入密码" v-model:value="password" @keydown="onKeyDownListener">
            <template #prefix>
              <i class="ri-lock-line"></i>
            </template>
          </a-input-password>
        </a-form-item>
        <!-- <a-form-item label="验证码" v-if="showVercode">
          <a-input-group compact>
            <a-input placeholder="请输入验证码" v-model:value="vercode" @keydown="onKeyDownListener">
              <template #prefix>
                <i class="ri-shield-keyhole-line"></i>
              </template>
            </a-input>
            <img :src="vercodePath" @click.prevent="onVercodeClick" />
          </a-input-group>
        </a-form-item> -->
        <a-form-item class="submit">
          <a-button type="primary" size="large" block @click.prevent="onLoginClick">登录</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import app from "@/app.js";
import { DEFAULT, URLS } from "@/config/config.js";
import { accountJson, menuList} from "@/config/state.js";

export default {
  data() {
    return {
      accountJson,
      account: "",
      password: "",
      vercode: "",
      vercodePath: "",
      vcodeToken: "",
      companyLogo: "",
      companyName: "",
      background: "",
      showVercode: true,
      ROOT_IMAGE: URLS.ROOT_IMAGE,
      VERSION: DEFAULT.VERSION_NAME,
    };
  },
  async created() {
    // if (this.showVercode) {
    //   this.onVercodeClick();
    // }
    if (!app.utils.isEmpty(app.getToken())) {
      this.toMain();
    }
  },
  methods: {
    async toMain() {
      const menuList = menuList;
      let fun = (item, callback) => {
        if (item.children && item.children.length > 0) {
          fun(item.children[0], callback);
        } else {
          console.log(item, item.path);
          callback(item.path);
        }
      };


      this.$router.replace({ path: "/print/index" });
      // if (menuList.length < 1) {
      //   if (!utils.isEmpty(app.getToken())) {
      //     app.showToast("请联系管理员配置菜单");
      //   }
      // } else {
      //   fun(menuList[0], (path) => {
      //     this.$router.replace({ path });
      //   });
      // }
    },
    onKeyDownListener(e) {
      if (e.keyCode == 13) {
        const { showVercode, vercode } = this;
        if (!showVercode || !app.utils.isEmpty(vercode)) {
          this.onLoginClick();
        }
      }
    },
    async onVercodeClick() {
      let res = await app.getAsync(app.URLS.VERIFY_CODE_TOKEN);
      this.vcodeToken = res.data;
      this.vercodePath =
        app.URLS.VERIFY_CODE + "?vcodeToken=" + this.vcodeToken;
    },
    async onLoginClick() {
      const { account, password, vercode, vcodeToken, showVercode } = this;
      const params = { loginType: DEFAULT.LOGIN_TYPE };
      if (app.utils.isEmpty(account)) {
        app.showToast("请输入用户名");
        return;
      }
      params.account = (account + "").trim();
      if (app.utils.isEmpty(password)) {
        app.showToast("请输入密码");
        return;
      }
      params.password = (password + "").trim();
      // if (showVercode) {
      //   if (app.utils.isEmpty(vercode)) {
      //     app.showToast("请输入验证码");
      //     return;
      //   }
      //   params.captcha = (vercode + "").trim();
      //   params.captchaToken = vcodeToken;
      // }
      app.showLoading();
      console.log(app.utils.getMD5String(params.password));
      if (!accountJson[params.account] || accountJson[params.account].pwd != app.utils.getMD5String(params.password) ) {
        app.hideLoading();
        app.showToast("用户名或密码错误");
      } else {
        app.hideLoading();
        app.setToken(params.account);
        app.userInfo.set({name: accountJson[params.account].name});
        this.toMain();
      }
      return;
      app.showLoading();
      const res = await app.postAsync(app.URLS.LOGIN, params);
      app.hideLoading();
      if (res.status == 0) {
        const { data } = res;
        app.setToken(data.token);
        app.userInfo.set(data.userInfo);
        this.toMain();
      } else {
        this.showVercode = true;
        this.onVercodeClick();
      }
    },
  },
};
</script>

<style lang="less">
#login {
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  top: 0;
  left: 0;
  display: flex;
  background: #fff;

  &::after {
    content: "";
    flex: 1;
    height: 100%;
    background: #f5f5f5 url("~@/assets/login-bg.jpg") center no-repeat;
    background-size: cover;
  }
}

.login-content {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  .ant-form {
    width: 320px;
    margin-bottom: 10%;

    .ant-input,
    .ant-input:focus {
      box-shadow: inset 0 0 100em white !important;
    }
  }

  .ant-input-group-compact {
    display: flex;

    .ant-input {
      flex: 1;
    }

    .login-captcha {
      width: auto;
      height: 32px;
      margin-left: 16px;
    }
  }

  .submit {
    margin-top: 64px;
  }
}

.login-logo {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  padding: 32px 24px;
  display: flex;
  align-items: center;
  transform: scale(0.85);

  i {
    font-size: 64px;
    color: #1890ff;
    margin-right: 8px;
  }

  h4 {
    line-height: 1.25;
    font-size: 28px;
  }

  span {
    display: block;
    text-transform: uppercase;
    color: fade(black, 45%);
  }
}
</style>
