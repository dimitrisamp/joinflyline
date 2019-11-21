import {
    airlineIcon,
    formatDate,
    formatTime,
    getRetailUrl, getSpecificRoute,
    proceedToBooking, secs2hm, staticUrl, timeInterval
} from "../../utils.js";

export const BookingTrip = Vue.component('booking-trip', {
    template: '#vue-booking-trip-template',
    delimiters: ['[[', ']]'],
    props: ['flight'],
    data() {
        return {
            collapsed: true,
        }
    },
    methods: {
        formatPassengerCountByCategory() {
            const passengers = this.flight.passengers;
            const valAdults = passengers.filter(o=>o.category='adults').length;
            const valChildren = passengers.filter(o=>o.category='children').length;
            const valInfants = passengers.filter(o=>o.category='infants').length;
            const adultsText = valAdults === 0 ? '' : `${valAdults} Adult${valAdults > 1 ? 's' : ''}`;
            const childrenText = valChildren === 0 ? '' : `${valChildren} Child${valChildren > 1 ? 'ren' : ''}`;
            const infantsText = valInfants === 0 ? '' : `${valInfants} Infant${valInfants > 1 ? 's' : ''}`;
            return [adultsText, childrenText, infantsText].filter((v) => v.length > 0).join(', ');
        },
        toggleCollapsed() {
            this.collapsed = !this.collapsed;
        },
        airlineIcon,
        formatDate,
        formatTime,
        getRetailUrl,
        getSpecificRoute,
        secs2hm,
        staticUrl,
        timeInterval
    }
});
