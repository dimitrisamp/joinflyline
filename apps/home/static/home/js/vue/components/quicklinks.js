import {secs2hm} from '../../utils.js';

Vue.component('quicklinks', {
    template: '#vue-quicklinks-template',
    props: ['data', 'sort'],
    delimiters: ['{(', ')}'],
    methods: {
        secs2hm,
        ...Vuex.mapActions(['sortResultsBy'])
    }
});
