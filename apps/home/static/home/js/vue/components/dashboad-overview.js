import api from "../http.js";
import { formatDateDeals } from "../../utils.js";

export const DashboadOverview = Vue.component("dashboad-overview", {
  data() {
    return {
      deals: [],
      suggested_deals: [],
      trip_summary: null,
      searchHistory: []
    };
  },
  metaInfo: {
    title: "Travel Portal | FlyLine"
  },
  template: "#vue-dashboad-overview-template",
  delimiters: ["[[", "]]"],
  methods: {
    ...Vuex.mapActions('search', ["setFormAndSearch"]),
    formatDateDeals,
    updateDeals() {
      if (!this.user || this.user.anonymous) return;
      api
        .get("/deals/", {
          params: {
            city_from: `${this.user.market.type}:${this.user.market.code}`
          }
        })
        .then(response => (this.suggested_deals = response.data.results));
    },
    performSearch(i) {
      this.setFormAndSearch(this.searchHistory[i]);
      this.$router.push({ name: "results" });
    }
  },
  watch: {
    user(value) {
      this.updateDeals();
    }
  },
  created() {
    api.get("/deals/").then(response => {
      this.deals = response.data.results;
    });
    api.get("/bookings/summary/").then(response => {
      this.trip_summary = response.data;
    });
    api.get("/search-history/").then(response => {
      this.searchHistory = response.data;
    });
    this.updateDeals();
  },
  computed: {
    ...Vuex.mapState('user', ["user"])
  }
});
