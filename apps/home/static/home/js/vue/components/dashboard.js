import {SearchForm} from "./search-form.js";

export const Dashboard = Vue.component("dashboard", {
  extends: SearchForm,
  template: "#vue-dashboard-template",
  methods: {
    proceedToSearchResults() {
      this.$router.push({name: 'results'});
    }
  }
});
