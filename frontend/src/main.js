import router from "./router";
import store from "./store";
import Vue from "vue";
import Vuex from "vuex";
import App from "./App.vue";

import VueMeta from "vue-meta";
import VueMq from "vue-mq";

Vue.use(VueMeta);
Vue.use(VueMq, {
  breakpoints: {
    // default breakpoints - customize this
    sm: 768,
    md: 1250,
    lg: Infinity
  },
  defaultBreakpoint: "sm" // customize this for SSR
});
new Vue({
  router,
  store,
  computed: {
    ...Vuex.mapState("user", ["user"])
  },
  created() {
    Promise.all([
      this.$store.dispatch("user/initializeUser"),
      this.$store.dispatch("plans/initializePlans")
    ]);
  },
  render: h => h(App)
}).$mount("#app");
