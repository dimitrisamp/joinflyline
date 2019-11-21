import {proceedToBooking, showPopup} from "../../../../utils.js";

Vue.component('search-result-mobile', {
    template: '#vue-search-result-mobile-template',
    props: ['data'],
    delimiters: ['{(', ')}'],
    methods: {
        showPopup,
        bookFlight(flight) {
            if (this.user.anonymous) {
                this.$emit('showPopup');
            } else {
                proceedToBooking(flight);
            }
        }
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
        },
        ...Vuex.mapState(['user']),
    }
});
