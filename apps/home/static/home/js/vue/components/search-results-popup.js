import { removeBModalOverlay } from '../../utils.js';

export const SearchResultsPopup = Vue.component('search-results-popup', {
    template: '#vue-search-results-popup-template',
    delimiters: ['[[', ']]'],
    methods: {
        handleGetStarted() {
            removeBModalOverlay();
        }
    }
});
