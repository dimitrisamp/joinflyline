import { router } from "./router.js";
import { store } from "./store.js";

const app = new Vue({
  router,
  store,
}).$mount("#app");
