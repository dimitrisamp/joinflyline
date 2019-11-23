export const BookingPage = Vue.component('booking-page', {
    template: '#vue-booking-page-template',
    delimiters: ['[[', ']]'],
    computed: {
        ...Vuex.mapState(['']),
        ...Vuex.mapGetters(['flightToBook'])
    }
});
