import { showPopup } from "../../utils.js";

Vue.component("search-results", {
  template: "#vue-search-results-template",
  methods: {
    showPopup,
    ...Vuex.mapActions(["loadMore", "sortResultsBy"])
  },
  delimiters: ["{(", ")}"],
  computed: {
    ...Vuex.mapState([
      "quickFiltersData",
      "searchResults",
      "form",
      "user",
      "searchProgress"
    ])
  }
});
