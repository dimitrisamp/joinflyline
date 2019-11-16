import {secs2hm} from '../../utils.js';

Vue.component('search-results', {
    template: '#vue-search-results-template',
    data () {
        return {
            popupVisible: false,
        }
    },
    methods: {
        showPopup() {
            $('#search-results-popup').modal();
        },
    },
    props: ['searchProgress', 'searchResults', 'loadMore', 'form', 'sortResultsBy', 'quickFiltersData', 'user'],
    delimiters: ['{(', ')}']
});
