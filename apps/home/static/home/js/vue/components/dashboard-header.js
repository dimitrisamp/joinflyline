import {SearchForm} from "./search-form.js";

export const DashboardHeader = Vue.component('dashboard-header', {
    extends: SearchForm,
    template: '#vue-dashboard-header-template',
    delimiters: ['[[', ']]'],
    computed: {
        ...Vuex.mapGetters(['toggleSidebar']),
    },
    data() {
      return {
        isOpen: false,
      }
    },
    watch: {
      $mq: {
        handler: 'showSearchFormHandler',
      }
    },
    mounted() {
      this.showSearchFormHandler();
    },
    methods: {
        doSearch() {
            this.search({clearFilters: true, saveSearch: true});
            this.$router.push({'name': 'results'})
        },
        showSearchFormHandler() {
          if(this.$mq == 'sm') {
            this.isOpen = false
          } else {
            this.isOpen = true
          }
        }
    }
});
