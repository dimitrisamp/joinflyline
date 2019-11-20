import { router } from "./router.js";
import { store } from "./store.js";
import { Sidebar } from "./components/sidebar.js";
import {DashboardHeader} from "./components/dashboard-header.js";

Vue.component('sidebar', Sidebar);
Vue.component('dashboard-header', DashboardHeader);

const app = new Vue({
  router,
  store,
/*  watch: {
    user(val, oldValue) {
      if (val.anonymous) {
        this.$router.push({'name': 'index'}, ()=>{});
      } else {
        this.$router.push({'name': 'overview'});
      }
    },
  },

 */
  created() {
    this.$store.dispatch('initialize');
  },
  computed: {
    ...Vuex.mapState(['user']),
  }
}).$mount("#app");
