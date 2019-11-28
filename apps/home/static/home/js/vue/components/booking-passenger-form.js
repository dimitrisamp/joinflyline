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
        cabin_bags: data.hand_bag.items?data.hand_bag.items.length:0,
        checked_bags: data.hold_bag.items?data.hold_bag.items.length:0,
      };
    }
  },
  template: "#vue-booking-passenger-form-template",
  delimiters: ["[[", "]]"]
});
