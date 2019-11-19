import { secs2hm } from "../../utils.js";

Vue.component("search-results", {
  template: "#vue-search-results-template",
  data() {
    return {
      popupVisible: false
    };
  },
  methods: {
    showPopup() {
      $("#search-results-popup").modal();
    },
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
