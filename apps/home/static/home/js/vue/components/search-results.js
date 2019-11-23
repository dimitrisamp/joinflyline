import { showPopup } from "../../utils.js";

Vue.component("search-results", {
  template: "#vue-search-results-template",
  methods: {
    showPopup,
    ...Vuex.mapMutations(['setSearchResultIndex']),
    ...Vuex.mapActions(["loadMore", "sortResultsBy"]),
    bookFlight(index) {
      this.setSearchResultIndex(index);
      this.$router.push({'name': 'booking'});
    }
  },
  delimiters: ["{(", ")}"],
  computed: {
    ...Vuex.mapState([
      "quickFiltersData",
      "searchResults",
      "form",
      "user",
      "searchProgress",
    ])
  }
});
