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
  methods: {
    updateDeals() {
      if (!this.user || this.user.anonymous) return;
      api
        .get("/deals/", {
          params: {
            city_from: this.user.profile.market.code
          }
        })
        .then(response => (this.suggested_deals = response.data.results));
    }

  },
  watch: {
    user(value) {
      this.updateDeals()
    }
  },
  created() {
    api.get("/deals/").then(response => (this.deals = response.data.results));
    this.updateDeals();
  },
  computed: {
    ...Vuex.mapState(["user"])
  }
});
