import { router } from "./router.js";
import { store } from "./store.js";
import { Sidebar } from "./components/sidebar.js";
import {DashboardHeader} from "./components/dashboard-header.js";

axios.defaults.headers.common['Authorization'] = `Token ${localStorage.getItem('authToken')}`;

Vue.component('sidebar', Sidebar);
Vue.component('dashboard-header', DashboardHeader);
Vue.use(VueMeta);

const app = new Vue({
  router,
  store,
  computed: {
    ...Vuex.mapState(['user']),
  }
}).$mount("#app");
