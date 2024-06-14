import { createApp } from "vue";
import App from "./App.vue";
import ArcoVue from "@arco-design/web-vue";
import router from "./router";
import store from "./store";
import "@arco-design/web-vue/dist/arco.css";
import "@/plugins/axios";
import "@/access";

createApp(App).use(store).use(router).use(ArcoVue).mount("#app");
