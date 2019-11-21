import {secs2hm} from '../../utils.js';

Vue.component('quicklinks', {
    template: '#vue-quicklinks-template',
    props: ['data', 'sort', 'airlinesFilter'],
    delimiters: ['{(', ')}'],
    methods: {
        secs2hm,
        ...Vuex.mapActions(['sortResultsBy', 'applyAirlinesFilter'])
    }
});
