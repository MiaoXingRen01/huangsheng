<template>
  <a-layout>
    <a-layout-header class="border-b"
      :style="{ position: 'fixed', zIndex: 1, width: '100%', background: '#fff', padding: '0 16px', display: 'flex', alignItems: 'center' }">
      <div class="leading-tight flex items-center py-2">
        <img src="@/assets/ecs-logo.png" class="h-12 mr-4" />
        <div>
          <h4 class="text-lg leading-none">出货单据打印系统</h4>
          <span class="text-xs opacity-45">Express Document Printing System</span>
        </div>
      </div>
      <a-row justify="space-between" class="ml-auto">
        <div class="page-info">
          <i :class="$route.meta.icon"></i>
          <!-- <h4>{{ $route.meta.title }}</h4> -->
        </div>
        <a-space size="middle">
          <span class="user-account">您好，{{ userName }}</span>
          <!-- <a-button shape="circle" @click.prevent="() => showChangePwdModal = true">
            <i class="ri-lock-line"></i>
          </a-button> -->
          <a-button shape="circle" @click.prevent="onLogoutClick">
            <i class="ri-shut-down-line"></i>
          </a-button>
        </a-space>
      </a-row>
    </a-layout-header>
    <a-layout :style="{ marginLeft: menuCollapsed ? '80px' : siderWidth + 'px' }">
      <a-layout-sider v-model:collapsed="menuCollapsed" :trigger="null" :width="siderWidth" theme="light" collapsible
        :style="{ overflowY: 'auto', position: 'fixed', left: 0, top: '64px', bottom: 0 }" class="border-r">
        <a-menu :openKeys="openKeys" @openChange="e => openKeys = e" :defaultSelectedKeys="[$route.path]"
          :selectedKeys="[$route.path]" mode="inline" class="py-2 !border-none">
          <template v-for="item in menulist">
            <sub-menu v-if="item.children && item.children.length > 0" :key="item.path" :menuInfo="item" />
            <a-menu-item v-else :key="item.path">
              <template #icon>
                <span>
                  <i :class="item.icon"></i>
                </span>
              </template>
              <router-link :to="{ path: item.path }" >{{ item.title }}</router-link>
            </a-menu-item>
          </template>
        </a-menu>
        <div class="absolute bottom-0 w-full border-t">
          <a-button class="!rounded-none" type="text" block size="large" @click="() => menuCollapsed = !menuCollapsed">
            <i :class="menuCollapsed ? 'ri-menu-unfold-fill' : 'ri-menu-fill'"></i>
          </a-button>
        </div>
      </a-layout-sider>
      <a-layout-content :style="{ marginTop: '64px' }">
        <router-view class="page"></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
  <a-modal v-model:visible="showChangePwdModal" title="修改密码" @ok="onChangePwdClick">
    <a-form :labelCol="{ span: 7 }" :wrapperCol="{ span: 13 }">
      <a-form-item label="原密码">
        <a-input-password placeholder="请输入原密码" v-model:value="oldPwd" />
      </a-form-item>
      <a-form-item label="新密码">
        <a-input-password placeholder="请输入新密码" v-model:value="newPwd1" />
      </a-form-item>
      <a-form-item label="密码确认">
        <a-input-password placeholder="请再输入一遍新密码" v-model:value="newPwd2" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import app from "@/app.js";
import utils from "@/config/utils.js";
import { URLS } from "@/config/config.js";
import subMenu from "./submenu.vue";
import { menuList } from "@/config/state.js";
export default {
  components: {
    "sub-menu": subMenu,
  },
  data() {
    return {
      siderWidth: 256,
      menuCollapsed: false,
      menulist: [],
      showChangePwdModal: false,
      openKeys: [],
      userName: "",
    };
  },
  async created() {
    const { name = "" } = app.userInfo.get();
    this.userName = name;
    this.menulist = menuList;
    this.openKeys = this.getDefaultOpenKeys(this.menulist);
  },
  methods: {
    getDefaultOpenKeys(list) {
      let keys = [];
      list.forEach((t) => {
        if (t.children && t.children.length > 0) {
          keys.push(t.url);
        }
      });
      return keys;
    },
    async onChangePwdClick() {
      let { oldPwd, newPwd1, newPwd2 } = this;
      if (utils.isEmpty(oldPwd)) {
        app.showToast("请输入原密码");
        return;
      }
      oldPwd = (oldPwd + "").trim();
      if (utils.isEmpty(newPwd1)) {
        app.showToast("请输入新密码");
        return;
      }
      newPwd1 = (newPwd1 + "").trim();
      if (newPwd1 != newPwd2) {
        app.showToast("两次密码输入不一致");
        return;
      }
      app.showLoading();
      const res = await app.postAsync(URLS.USER_PASSWORD_UPD, {
        oldpwd: oldPwd,
        newpwd: newPwd1,
      });
      app.hideLoading();
      if (res.status == 0) {
        this.showChangePwdModal = false;
        app.showToast(res.message);
        app.toLogin();
      }
    },
    onLogoutClick() {
      this.$confirm({
        title: "提示",
        content: "确定要退出登录吗？",
        onOk: async () => {
          app.showLoading();
          // let res = await app.postAsync(URLS.LOGOUT);
          app.hideLoading();
          app.toLogin();
        },
      });
    },
  },
};
</script>