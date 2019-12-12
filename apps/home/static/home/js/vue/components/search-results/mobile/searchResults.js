import {showPopup} from "../../../../utils.js";

Vue.component('search-results-mobile', {
    template: '#vue-search-results-mobile-template',
    methods: {
        backPressed() {
            this.$emit('back-pressed');
        },
        showPopup,
        ...Vuex.mapActions("search", ['sortResultsBy'])
    },
    delimiters: ['{(', ')}'],
    computed: {
        ...Vuex.mapState("search", ['searchProgress', 'searchResults', 'form']),
    }
});
