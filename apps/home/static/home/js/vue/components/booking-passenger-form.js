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
  props: ["checkFlightData", "passenger"],
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
      this.p = {
        ...this.p,
        cabin_bags: data.hand_bag.indices.length,
        checked_bags: data.hold_bag.indices.length,
      };
    }
  },
  template: "#vue-booking-passenger-form-template",
  delimiters: ["[[", "]]"]
});
