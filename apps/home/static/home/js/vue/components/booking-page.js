function makePassenger() {
  return {
    name: "",
    surname: "",
    nationality: null,
    birthday: null,
    title: null,
    cardno: "",
    expiration: "",
    cabin_bags: 0,
    checked_bags: 0,
  }
}

export const BookingPage = Vue.component("booking-page", {
  template: "#vue-booking-page-template",
  delimiters: ["[[", "]]"],
  data() {
    return {
      form: {
        promocode: "",
        holder_name: "",
        card_number: "",
        expiry: "",
        credit_card_cvv: "",
        email: "",
        phone: "",
      },
      passengers: [],
    }
  },
  computed: {
    ...Vuex.mapGetters(["flightToBook"])
  }
});
