import { router } from "./router.js";
import { store } from "./store/index.js";
import { Sidebar } from "./components/sidebar.js";
import {DashboardHeader} from "./components/dashboard-header.js";
const {mapState} = Vuex.createNamespacedHelpers('user');

axios.defaults.headers.common['Authorization'] = `Token ${localStorage.getItem('authToken')}`;

Vue.component('sidebar', Sidebar);
Vue.component('dashboard-header', DashboardHeader);
Vue.use(VueMeta);
Vue.use(VueScrollTo);
const app = new Vue({
  router,
  store,
  computed: {
    ...mapState(['user']),
  }
}).$mount("#app");
