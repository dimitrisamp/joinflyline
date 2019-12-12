import { showPopup } from "../../utils.js";

Vue.component("search-results", {
  template: "#vue-search-results-template",
  methods: {
    showPopup,
    ...Vuex.mapMutations('search', ['setSearchResultIndex']),
    ...Vuex.mapActions('search', ["loadMore", "sortResultsBy"]),
    bookFlight(index) {
      this.setSearchResultIndex(index);
      this.$router.push({'name': 'booking'});
    }
  },
  delimiters: ["{(", ")}"],
  computed: {
    ...Vuex.mapState('search',[
      "quickFiltersData",
      "searchResults",
      "form",
      "searchProgress",
    ]),
    ...Vuex.mapState('user', ['user']),
  }
});
