import {
  airlineIcon,
  seatTypes,
  formatDate,
  formatTime,
  secs2hm,
  timeInterval
} from "../../utils.js";


export const BookingFlightDetails = Vue.component("booking-flight-details", {
  template: "#vue-booking-flight-details-template",
  props: ["flight"],
  data() {
    return {
      seatTypes,
    }
  },
  methods: {
    airlineIcon,
    formatDate,
    secs2hm,
    formatTime,
    timeInterval,
  },
  delimiters: ["[[", "]]"]
});
