import {proceedToBooking} from "../../../../utils.js";

Vue.component('search-result-mobile', {
    template: '#vue-search-result-mobile-template',
    props: ['data'],
    delimiters: ['{(', ')}'],
    methods: {
        proceedToBooking,
    },
    computed: {
        flightsTo() {
            return this.data.route.filter(o=>o.return===0);
        },
        flightsReturn() {
            return this.data.route.filter(o=>o.return===1);
        },
        nightsInDest() {
            return this.data.nightsInDest;
        },
        dest() {
            return this.data.cityTo;
        },
        price() {
            return this.data.conversion.USD;
        }
    }
});
