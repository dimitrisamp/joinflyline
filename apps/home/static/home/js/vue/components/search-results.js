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
      "form",
      "searchProgress",
    ]),
    ...Vuex.mapGetters('search', [
        "finalResults",
        "quickFiltersData",
    ]),
    ...Vuex.mapState('user', ['user']),
  }
});
