import { SearchForm } from "./search-form.js";
import { FilterForm } from "./filter-form.js";
import { trending } from "../trending.js";

export const MainLandingHero = Vue.component("main-landing-hero", {
  template: "#vue-main-landing-hero-template",
  delimiters: ["[[", "]]"],
  mixins: [SearchForm, FilterForm],
  data() {
    return {
      trending
    };
  },
  methods: {
    ...Vuex.mapMutations('search', ['updatePlaceFrom', 'updatePlaceTo']),
    searchFromHome() {
      this.search({ clearFilters: true, saveSearch: false });
      this.$router.push({ name: "search-results" });
    },
    setFormFromTo(i) {
      const data = this.trending[i];
      this.updatePlaceFrom(data.from);
      this.updatePlaceTo(data.to);
    }
  }
});
