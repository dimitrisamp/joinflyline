Vue.component('search-results-mobile', {
    template: '#vue-search-results-mobile-template',
    props: ['searchResults', 'sortResultsBy', 'placeTo', 'placeFrom', 'form'],
    methods: {
        backPressed() {
            this.$emit('back-pressed');
        }
    },
    delimiters: ['{(', ')}'],
    computed: {
    }
});
