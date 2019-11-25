import {SearchForm} from "./search-form.js";

export const DashboardHeader = Vue.component('dashboard-header', {
    extends: SearchForm,
    template: '#vue-dashboard-header-template',
    delimiters: ['[[', ']]'],
    computed: {
        ...Vuex.mapGetters(['toggleSidebar']),
    },
    methods: {
        doSearch() {
            this.search();
            this.$router.push({'name': 'results'})
        }
    }
});
