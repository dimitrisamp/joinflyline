import {SearchForm} from "./search-form.js";
import {FilterForm} from "./filter-form.js";

export const SearchResultsPage = Vue.component('search-results-page', {
  template: '#vue-search-results-page-template',
  delimiters: ['[[', ']]'],
  mixins: [SearchForm, FilterForm],
  metaInfo() {
    let cityFromToTitle = this.cityFromTo ? this.cityFromTo : '';
    return {
      title: `FlyLine | Search Results | ${cityFromToTitle}`
    }
  },
  computed: {
    ...Vuex.mapState(['searchProgress', 'searchResults', 'user', 'form']),
      ...Vuex.mapGetters(['airlineNames', 'cityFromTo']),
      isMobile() {
        return this.$mq === 'sm';
      }
  },
  mounted() {
    this.calcHeightOfHeader();
    window.addEventListener('resize', this.calcHeightOfHeader);
  },
  methods: {
    calcHeightOfHeader() {
      const headerEl = document.querySelector('.header');
      const searchContainer = document.querySelector('.search-result__container');
      const searchForm = document.querySelector('.search-result__container__left');
      searchForm ? searchForm.style.top = headerEl.offsetHeight + 'px' : 0;
      if (headerEl) {
        const headerHeight = headerEl.offsetHeight;
        searchContainer.style.paddingTop = (headerHeight) + 'px';
      }
    },
  }
});
