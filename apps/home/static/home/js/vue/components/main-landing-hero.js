import {SearchForm} from "./search-form.js";
import {FilterForm} from "./filter-form.js";
export const MainLandingHero = Vue.component('main-landing-hero', {
    template: '#vue-main-landing-hero-template',
    delimiters: ['[[', ']]'],
    mixins: [SearchForm, FilterForm],
    methods: {
      searchFromHome() {
        this.search(true);
        this.$router.push({'name': 'search-results'});
      },
    }
});
