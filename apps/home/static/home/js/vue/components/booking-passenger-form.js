import { isoCountries } from "../../countries.js";

export const BookingPassengerForm = Vue.component("booking-passenger-form", {
  props: ["checkedFlight", "passenger"],
  data() {
    return {
      isoCountries,
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ]
    };
  },
  template: "#vue-booking-passenger-form-template",
  delimiters: ["[[", "]]"]
});
