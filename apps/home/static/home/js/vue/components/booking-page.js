import {getAgeCategory} from '../../utils.js';

const checkInterval = 15000;

const checkFlightsApiUrl =
  "https://kiwicom-prod.apigee.net/v2/booking/check_flights";

const sampleAge = {
  adults: 20,
  children: 10,
  infants: 1
};

function makePassenger(primary = true, category = "adults") {
  let today = new Date();
  let birthDate = new Date(today.getTime());
  birthDate.setFullYear(
    today.getFullYear() - sampleAge[category]
  );
  return {
    isPrimary: primary,
    name: "",
    surname: "",
    nationality: "US",
    month: birthDate.getMonth(),
    day: birthDate.getDay(),
    year: birthDate.getFullYear(),
    title: null,
    cardno: "",
    expiration: "",
    combinations: {
      hand_bag: 0,
      hold_bag: 0
    }
  };
}


export const BookingPage = Vue.component("booking-page", {
  template: "#vue-booking-page-template",
  delimiters: ["[[", "]]"],
  data() {
    let seats = { ...this.$store.getters.flightToBook.parent.search_params.seats };
    delete seats.passengers;
    let initialPassengers = [];
    if (seats.adults > 0) {
      seats.adults = seats.adults - 1;
      initialPassengers.push(makePassenger());
    }
    for (let [category, count] of Object.entries(seats)) {
      for (let i = 0; i < count; i++) {
        initialPassengers.push(makePassenger(false, category));
      }
    }
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
      passengers: initialPassengers,
      checkFlightData: null,
      lastCheck: null,
      flightChecked: false,
      flightInvalid: false,
      checkFlightProgress: false,
      interval: null
    };
  },
  watch: {
    formState: {
      handler() {
        this.checkFlight();
      },
      deep: true,
    }
  },
  methods: {
    addPassenger() {
      this.passengers.push(makePassenger(false));
    },
    updatePassenger(i, data) {
      this.$set(this.passengers, i, data);
    },
    checkFlightRequired() {
      if (!this.checkFlightData) return true;
      if (this.flightInvalid) return false;
      if (this.flightChecked) {
        return new Date() - this.lastCheck > checkInterval;
      }
      return true;
    },
    baggageParameter() {
      let combinationPassengers = {};
      for (let [passengerIndex, passenger] of this.passengers.entries()) {
        for (let [category, combinationIndex] of Object.entries(passenger.combinations)) {
          combinationPassengers[category] = combinationPassengers[category] || new Map();
          if (!combinationPassengers[category].has(combinationIndex)) combinationPassengers[category].set(combinationIndex, []);
          combinationPassengers[category].get(combinationIndex).push(passengerIndex);
        }
        let result = [];
        for (let [category, ci] of Object.entries(combinationPassengers)) {
          for (let [combinationIndex, passengers] of ci.entries()) {
            result.push({
              combination: {...this.checkFlightData.baggage.combinations[category][combinationIndex]},
              passengers: [...passengers]
            })
          }
        }
        return result;
      }
    },
    checkFlight() {
      if (this.checkFlightRequired && !this.checkFlightProgress) {
        this.checkFlightProgress = true;
        axios
          .get(checkFlightsApiUrl, {
            params: {
              v: 2,
              currency: "USD",
              booking_token: this.flightToBook.booking_token,
              ...this.formState
            },
            headers: {
              apikey: "xklKtpJ5fxZnk4rsDepqOzLUaYYAO9dI"
            }
          })
          .then(response => {
            const cf = response.data;
            this.flightInvalid = cf.flights_invalid;
            this.flightChecked = cf.flights_checked;
            this.lastCheck = new Date();
            this.checkFlightData = cf;
          })
          .finally(() => {
            this.checkFlightProgress = false;
          });
      }
    },
    bagsPrices() {
      let totalPrice = 0;
      for (const p of this.passengers) {
        for (let [categoryName, combinationIndex] of Object.entries(p.combinations)) {
          totalPrice += this.checkFlightData.baggage.combinations[categoryName][combinationIndex].price.amount;
        }
      }
      return totalPrice;
    },
    factor() {
      if (!this.checkFlightData) {
        const c = this.flightToBook.conversion;
        return c.USD / c.EUR;
      }
      return this.checkFlightData.conversion.amount / this.checkFlightData.total;
    },
    convertToUsd(price) {
      return Math.round(price * this.factor() * 100) / 100;
    },
    book() {
      console.log(this.baggageParameter());
    }
  },
  computed: {
    ...Vuex.mapGetters(["flightToBook"]),
    passengerCount() {
      if (!this.passengers) return {adults: 0, children: 0, infants: 0, pnum: 0};
      const categories = this.passengers.map(getAgeCategory);
      const counter = categories.reduce(
        (c, val) => c.set(val, 1 + (c.get(val) || 0)),
        new Map([["infants", 0], ["children", 0], ["adults", 0]])
      );
      const result = Object.fromEntries(counter.entries());
      const pnum = Object.values(result).reduce((a, b) => a + b);
      return { ...result, pnum };
    },
    prices() {
      if (!this.checkFlightData) {
        return {
          total: this.flightToBook.conversion.USD,
          bags: null,
          exact: false
        };
      }
      const prices = this.checkFlightData.conversion;
      const result = {
        adults: prices.adults_price,
        children: prices.children_price,
        infants: prices.infants_price
      };
      const passengers = Object.values(result).reduce((a, b) => a + b);
      const bagsPrice = this.convertToUsd(this.bagsPrices());
      return {
        ...result,
        passengers,
        baggage: bagsPrice,
        total: passengers + bagsPrice,
        exact: this.checkFlightData?this.checkFlightData.flightsChecked:false,
      }
    },
    formState() {
      return {
        bnum: 0,
        ...this.passengerCount
      };
    }
  },
  mounted() {
    this.interval = setInterval(this.checkFlight, 5000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  }
});
