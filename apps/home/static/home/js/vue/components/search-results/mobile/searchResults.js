import {showPopup} from "../../../../utils.js";

Vue.component('search-results-mobile', {
    template: '#vue-search-results-mobile-template',
    methods: {
        backPressed() {
            this.$emit('back-pressed');
        },
        showPopup,
        ...Vuex.mapActions(['sortResultsBy'])
    },
    delimiters: ['{(', ')}'],
    computed: {
        ...Vuex.mapState(['searchProgress', 'searchResults', 'form']),
    }
});
