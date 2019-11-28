export const BookingTotals = Vue.component('booking-totals', {
    template: '#vue-booking-totals-template',
    props: ['prices', 'count'],
    delimiters: ['[[', ']]'],
});
