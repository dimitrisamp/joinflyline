import { FilterForm } from "./filter-form.js";

export const ResultComponent = Vue.component("result-component", {
  mixins: [FilterForm],
  template: "#vue-result-component-template",
  delimiters: ["[[", "]]"],
  components: {
    VueSlider: window["vue-slider-component"]
  },
  data() {
    return {
      searchProgress: false,
      user: {
        anonymous: true,
        value3: [0, 50],
      },
    };
  },
  methods: {
    ...Vuex.mapActions(["sortResultsBy", "loadMore", "search"]),
    ...Vuex.mapMutations(["setMaxStops"])
  },
  computed: {
    ...Vuex.mapState(["searchResults", "quickFiltersData", "form"]),
    ...Vuex.mapGetters(["cityFromTo", "airlineNames"])
  }
});
