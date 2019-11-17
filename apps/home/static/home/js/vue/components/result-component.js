import data from '../data.js'
export const ResultComponent = Vue.component('result-component', {
    template: '#vue-result-component-template',
    delimiters: ['[[', ']]'],
    data () {
        return {
            searchProgress: false,
            form: data.form,
            quickFiltersData: data.quickFiltersData,
            user: {
                "anonymous": true
            },
            searchResults: data.searchResults,
            sortResultsBy: () => {},
            loadMore: null,
        }
    },
});
