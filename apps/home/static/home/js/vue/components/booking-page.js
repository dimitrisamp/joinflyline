const checkFlightsApiUrl =
  "https://kiwicom-prod.apigee.net/v2/booking/check_flights";


const sampleAge = {
  'adults': 20,
  'children': 10,
  'infants': 1
};

function makePassenger(primary = true, category = 'adult') {
  let today = new Date();
  const birthDate = today.setFullYear(today.getFullYear() - sampleAge[category]);
  return {
    isPrimary: primary,
    name: "",
    surname: "",
    nationality: 'US',
    month: birthDate.getMonth(),
    day: birthDate.getDay(),
    year: birthDate.getFullYear(),
    title: null,
    cardno: "",
    expiration: "",
    cabin_bags: 0,
    checked_bags: 0
  };
}

function getAgeCategory(p) {
  const birthDate = new Date(p.year, p.month, p.day);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  let m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  if (age < 3) {
    return "infants";
  }
  if (age < 13) {
    return "children";
  }
  return "adults";
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
        phone: ""
      },
      passengers: [makePassenger()],
      checkedFlight: null
    };
  },
  methods: {
    addPassenger() {
      this.passengers.push(makePassenger(false));
    },
    checkFlight() {
      axios
        .get(checkFlightsApiUrl, {
          params: {
            v: 2,
            currency: "USD",
            booking_token: this.flightToBook.booking_token,
            bnum: this.bagsCount,
            ...this.passengerCount
          },
          headers: {
            apikey: "xklKtpJ5fxZnk4rsDepqOzLUaYYAO9dI"
          }
        })
        .then(response => {
          const cf = response.data;
          if (cf.flights_invalid) {
            this.flightInvalid = true;
            return;
          }
          if (cf.flights_checked === false) {
            setTimeout(this.checkFlight, 1000);
          }
          this.checkedFlight = cf;
        });
    }
  },
  computed: {
    ...Vuex.mapGetters(["flightToBook"]),
    passengerCount() {
      const categories = this.passengers.map(getAgeCategory);
      const counter = categories.reduce(
        (c, val) => c.set(val, 1 + (c.get(val) || 0)),
        new Map([["infants", 0], ["children", 0], ["adults", 0]])
      );
      const result = Object.fromEntries(counter.entries());
      const pnum = Object.values(result).reduce((a, b) => a + b);
      return { ...result, pnum };
    },
    bagsCount() {
      return this.passengers
        .map(p => p.cabin_bags + p.checked_bags)
        .reduce((a, b) => a + b);
    },
    prices() {
      if (!this.checkedFlight) {
        return {
          total: this.flightToBook.conversion.USD,
          bags: null,
          exact: false,
        };
      }
      const prices = this.checkedFlight.conversion;
      const result = {
        adults: prices.adults_price,
        children: prices.children_price,
        infants: prices.infants_price
      };
      const passengers = Object.values(result).reduce((a, b) => a + b);
      return {
        ...result,
        passengers,
        bags: prices.amount - passengers,
        total: prices.amount,
        exact: this.checkedFlight.flightsChecked,
      };
    }
  },
  mounted() {
    this.checkFlight();
  }
});
