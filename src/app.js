import Vue from "vue";
import App from "./App.vue";
import { createRouter } from "../src/config/router.js";
import { createStore } from "../src/config/store.js";
import { sync } from "vuex-router-sync";

// 导出一个工厂函数，用于创建新的
// 应用程序、router 和 store 实例
export function createApp() {
  // 创建 router 实例
  const router = createRouter();
  const store = createStore();
  // 同步路由状态(route state)到 store
  sync(store, router);
  const app = new Vue({
    router,
    store,
    // 根实例简单的渲染应用程序组件。
    render: (h) => h(App),
  });
  return { app, router, store };
}
