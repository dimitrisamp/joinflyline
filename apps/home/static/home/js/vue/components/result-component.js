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
    ...Vuex.mapActions('search', ["sortResultsBy", "loadMore", "search"]),
    ...Vuex.mapMutations('search', ["setMaxStops"])
  },
  computed: {
    ...Vuex.mapState('search', ["searchResults", "quickFiltersData", "form"]),
    ...Vuex.mapGetters('search', ["cityFromTo", "airlineNames"])
  }
});
