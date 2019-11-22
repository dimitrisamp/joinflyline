import {secs2hm} from '../../utils.js';

Vue.component('quicklinks', {
    template: '#vue-quicklinks-template',
    props: ['data', 'sort', 'airlinesFilter'],
    delimiters: ['{(', ')}'],
    computed: {
        ...Vuex.mapState(['user']),
        columns() {
          const additionalCol = this.user && this.user.anonymous? {date: 'Earliest'} : {};
          return {
            price: 'Cheapest', 
            quality: 'Recommended', 
            duration: 'Quickest',
            ...additionalCol
          }
        }
    },
    methods: {
        secs2hm,
        ...Vuex.mapActions(['sortResultsBy', 'applyAirlinesFilter'])
    }
});
