import { createApp } from "./app";

// 客户端特定引导逻辑……

const { app, router,store } = createApp();
/* 
当使用 template 时，context.state 将作为 window.__INITIAL_STATE__ 状态，自动嵌入到最终的 HTML 中。
而在客户端，在挂载到应用程序之前，store 就应该获取到状态
*/
console.log('window.__INITIAL_STATE__',window.__INITIAL_STATE__)
if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__)
  }
router.onReady(() => {
  // Add router hook for handling asyncData.
  // Doing it after initial route is resolved so that we don't double-fetch
  // the data that we already have. Using router.beforeResolve() so that all
  // async components are resolved.
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to);
    const prevMatched = router.getMatchedComponents(from);
    let diffed = false;
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = prevMatched[i] !== c);
    });
    const asyncDataHooks = activated.map((c) => c.asyncData).filter((_) => _);
    if (!asyncDataHooks.length) {
      return next();
    }
    Promise.all(asyncDataHooks.map((hook) => hook({ store, route: to })))
      .then(() => {
        next();
      })
      .catch(next);
  });
  // actually mount to DOM
  app.$mount("#app");
});
