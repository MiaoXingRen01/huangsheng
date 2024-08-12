<template>
    <a-config-provider :locale="locale" :autoInsertSpaceInButton="false">
        <router-view />
    </a-config-provider>
</template>

<script>
import app from "@/app.js";
import { theme } from 'ant-design-vue';
import zhCN from "ant-design-vue/es/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
dayjs.locale("zhCN");
export default {
  data() {
    return {
      locale: zhCN,
    };
  },
  mounted(){
    theme.defaultConfig.token.borderRadius = 0;
    if (app.utils.isEmpty(app.getToken())) {
      this.$router.replace({ path: "/login" });
    }
  }
};
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>