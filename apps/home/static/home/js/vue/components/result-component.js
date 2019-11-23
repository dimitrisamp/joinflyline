import { FilterForm } from "./filter-form.js";

export const ResultComponent = Vue.component("result-component", {
  mixins: [FilterForm],
  template: "#vue-result-component-template",
  delimiters: ["[[", "]]"],
  data() {
    return {
      searchProgress: false,
      user: {
        anonymous: true
      },
    };
  },
  methods: {
    ...Vuex.mapActions(["sortResultsBy", "loadMore"]),
  },
  computed: {
    ...Vuex.mapState(["searchResults", "quickFiltersData", "form"]),
    ...Vuex.mapGetters(["cityFromTo", "airlineNames"])
  }
});
