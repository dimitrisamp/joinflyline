import api from "../http.js";

export const DashboadOverview = Vue.component("dashboad-overview", {
  data() {
    return {
      deals: [],
      suggested_deals: []
    };
  },
  template: "#vue-dashboad-overview-template",
  delimiters: ["[[", "]]"],
  watch: {
    user(value) {
      if(!value) return;
      api
        .get("/deals/", {
          params: {
            city_from: this.user.profile.market.code
          }
        })
        .then(response => (this.suggested_deals = response.data.results));
    }
  },
  created() {
    api.get("/deals/").then(response => (this.deals = response.data.results));
  },
  computed: {
    ...Vuex.mapState(["user"])
  }
});
