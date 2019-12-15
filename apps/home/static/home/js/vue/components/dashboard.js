import {SearchForm} from "./search-form.js";

export const Dashboard = Vue.component("dashboard", {
  template: "#vue-dashboard-template",
  watch: {
    // $route() {
    //   if(this.$route.name === 'booking') {
    //    this.$store.commit('hideDashboardNav')
    //   } else {
    //     this.$store.commit('showDashboardNav')
    //   }
    // }
  },
  computed: {
    ...Vuex.mapState('dashboard', ['showDashboardNavigation'])
  },
  methods: {
    proceedToSearchResults() {
      this.$router.push({name: 'results'});
    }
  }
});
