import {SearchForm} from "./search-form.js";
import {FilterForm} from "./filter-form.js";

export const SearchResultsPage = Vue.component('search-results-page', {
  template: '#vue-search-results-page-template',
  delimiters: ['[[', ']]'],
    mixins: [SearchForm, FilterForm],
  computed: {
    ...Vuex.mapState(['searchProgress', 'searchResults', 'user', 'form']),
      ...Vuex.mapGetters(['airlineNames', 'cityFromTo']),
      isMobile() {
        return this.$mq === 'sm';
      }
  }
});
