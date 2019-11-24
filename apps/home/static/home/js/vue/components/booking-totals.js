export const BookingTotals = Vue.component('booking-totals', {
    template: '#vue-booking-totals-template',
    props: ['passenger_count', 'passenger_price', 'baggage_price', 'total_price'],
    delimiters: ['[[', ']]'],
});
