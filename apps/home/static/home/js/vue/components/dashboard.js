import {SearchForm} from "./search-form.js";
import { store } from "../store.js";

export const Dashboard = Vue.component("dashboard", {
  template: "#vue-dashboard-template",
  watch: {
    $route() {
      if(this.$route.path === '/dashboard/booking') {
       this.$store.commit('hideDashboardNav')
      } else {
        this.$store.commit('showDashboardNav')
      }
    }
  },
  computed: {
    ...Vuex.mapState(['showDashboardNavigation'])
  },
  methods: {
    proceedToSearchResults() {
      this.$router.push({name: 'results'});
    }
  }
});
