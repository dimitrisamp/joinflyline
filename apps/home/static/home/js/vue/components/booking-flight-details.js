import {airlineIcon, formatDate, formatTime, secs2hm, timeInterval} from "../../utils.js";

export const BookingFlightDetails = Vue.component('booking-flight-details', {
  template: '#vue-booking-flight-details-template',
  props: ['flight'],
  methods: {
    airlineIcon,
    formatDate,
    secs2hm,
    formatTime,
    timeInterval,
  },
  delimiters: ['[[', ']]'],
});
