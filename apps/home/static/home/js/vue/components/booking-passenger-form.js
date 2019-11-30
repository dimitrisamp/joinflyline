import { isoCountries } from "../../countries.js";

const months = [
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
];

export const BookingPassengerForm = Vue.component("booking-passenger-form", {
  props: ["checkFlightData", "passenger", "convertToUsd"],
  data() {
    let passengerData = { ...this.$props.passenger };
    return {
      isoCountries,
      months,
      p: passengerData
    };
  },
  watch: {
    p: {
      handler(val) {
        this.$emit("passenger-updated", val);
      },
      deep: true
    }
  },
  methods: {
    updateBaggage(data) {
      this.$set(this.p, 'combinations', data);
    }
  },
  template: "#vue-booking-passenger-form-template",
  delimiters: ["[[", "]]"]
});
