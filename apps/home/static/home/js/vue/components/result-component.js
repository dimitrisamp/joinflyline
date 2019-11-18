export const ResultComponent = Vue.component('result-component', {
    template: '#vue-result-component-template',
    delimiters: ['[[', ']]'],
    data () {
        return {
            searchProgress: false,
            user: {
                "anonymous": true
            },
            sortResultsBy: () => {},
            loadMore: null,
        }
    },
    computed: {
        ...Vuex.mapState(
          ['searchResults', 'quickFiltersData', 'form']
        ),
    }
});
