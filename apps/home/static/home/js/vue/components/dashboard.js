import {SearchForm} from "./search-form.js";

export const Dashboard = Vue.component("dashboard", {
  template: "#vue-dashboard-template",
  methods: {
    proceedToSearchResults() {
      this.$router.push({name: 'results'});
    }
  }
});
