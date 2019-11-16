import { router } from "./router.js";
import { store } from "./store.js";
import { Sidebar } from "./components/sidebar.js";
import {DashboardHeader} from "./components/dashboard-header.js";

Vue.component('sidebar', Sidebar);
Vue.component('dashboard-header', DashboardHeader)

const app = new Vue({
  router,
  store,
}).$mount("#app");
