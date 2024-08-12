import { createApp } from "vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import App from "./App.vue";
import router from "./router.js";
import store from "./store";

import "remixicon/fonts/remixicon.css";
import "@/style.less";
import "@/loadingModalStyle.less";
import viewer from "./components/viewer";
import app from "./app.js";
import "echarts";
app.onLaunch();
createApp(App)
	.use(store)
	.use(router)
	.use(Antd)
	.component("viewer", viewer)
	.mount("#app");
