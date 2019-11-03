import {secs2hm} from './utils.js';

Vue.component('search-results', {
    template: '#vue-search-results-template',
    props: ['searchProgress', 'searchResults', 'loadMore', 'form', 'sortResultsBy', 'quickFiltersData'],
    delimiters: ['{(', ')}']
});
