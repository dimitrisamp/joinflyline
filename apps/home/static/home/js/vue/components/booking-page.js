import { getAgeCategory } from "../../utils.js";
import api from "../http.js";

const checkInterval = 15000;

const checkFlightsApiUrl = "/booking/check_flights/";

const saveBookingApiUrl = "/book/";

const sampleAge = {
  adults: 20,
  children: 10,
  infants: 1
};

const genderToTitle = {0: 'mr', 1: 'ms'}

function makePassenger(primary = true, category = "adults", user_data = null) {
  let dataValues;

  if (user_data) {
    dataValues = {
      name: user_data.name,
      surname: user_data.surname,
      nationality: user_data.nationality,
      month: user_data.month,
      day: user_data.day,
      year: user_data.year,
      title: user_data.title,
    };
  } else {
    let today = new Date();
    let birthDate = new Date(today.getTime());
    birthDate.setFullYear(today.getFullYear() - sampleAge[category]);

    dataValues = {
      name: "",
      surname: "",
      nationality: "US",
      month: birthDate.getMonth(),
      day: birthDate.getDay(),
      year: birthDate.getFullYear(),
      title: 0,
    };
  }

  return {
    isPrimary: primary,
    cardno: "",
    expiration: "",
    combinations: {
      hand_bag: 0,
      hold_bag: 0
    },
    ...dataValues
  };
}

function formatUserData(user) {
  let bdate = moment(user.dob);

  return {
    name: user.first_name,
    surname: user.last_name,
    nationality: "US",
    month: bdate.month() + 1,
    day: bdate.date(),
    year: bdate.year(),
    title: genderToTitle[user.gender] || 0
  }
}

export const BookingPage = Vue.component("booking-page", {
  template: "#vue-booking-page-template",
  delimiters: ["[[", "]]"],
  data() {
    let seats = {
      ...this.$store.getters.flightToBook.parent.search_params.seats
    };
    let user = {
      ...this.$store.getters.user
    };
    delete seats.passengers;
    let initialPassengers = [];
    if (seats.adults > 0) {
      seats.adults = seats.adults - 1;
      initialPassengers.push(makePassenger(true, "adults", formatUserData(user)));
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
        email: user.email,
        phone: user.phone_number
      },
      passengers: initialPassengers,
      checkFlightData: null,
      lastCheck: null,
      flightChecked: false,
      flightInvalid: false,
      checkFlightProgress: false,
      interval: null,
      bookingProgress: false
    };
  },
  watch: {
    formState: {
      handler() {
        this.checkFlight();
      },
      deep: true
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
        for (let [category, combinationIndex] of Object.entries(
          passenger.combinations
        )) {
          combinationPassengers[category] =
            combinationPassengers[category] || new Map();
          if (!combinationPassengers[category].has(combinationIndex))
            combinationPassengers[category].set(combinationIndex, []);
          combinationPassengers[category]
            .get(combinationIndex)
            .push(passengerIndex);
        }
        let result = [];
        for (let [category, ci] of Object.entries(combinationPassengers)) {
          for (let [combinationIndex, passengers] of ci.entries()) {
            const combination = this.checkFlightData.baggage.combinations[
              category
            ][combinationIndex];
            if (combination.indices.length > 0) {
              result.push({
                combination: { ...combination },
                passengers: [...passengers]
              });
            }
          }
        }
        return result;
      }
    },
    passengersParameter() {
      return this.passengers.map(p => {
        return {
          birthday: new Date(p.year, p.month, p.day),
          name: p.name,
          surname: p.surname,
          nationality: p.nationality,
          title: p.title,
          cardno: p.cardno,
          expiration: p.expiration,
          category: getAgeCategory(p, true)
        };
      });
    },
    saveBooking() {
      return api({
        url: saveBookingApiUrl,
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        data: {
          booking_token: this.flightToBook.booking_token,
          baggage: this.baggageParameter(),
          lang: "en",
          locale: "en",
          currency: "usd",
          passengers: this.passengersParameter(),
          payment_gateway: "payu",
          payment: this.form,
          retail_info: this.flightToBook
        }
      });
    },
    checkFlight() {
      if (this.checkFlightRequired && !this.checkFlightProgress) {
        this.checkFlightProgress = true;
        api
          .get(checkFlightsApiUrl, {
            params: {
              v: 2,
              currency: "USD",
              booking_token: this.flightToBook.booking_token,
              ...this.formState
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
        for (let [categoryName, combinationIndex] of Object.entries(
          p.combinations
        )) {
          totalPrice += this.checkFlightData.baggage.combinations[categoryName][
            combinationIndex
          ].price.amount;
        }
      }
      return totalPrice;
    },
    factor() {
      if (!this.checkFlightData) {
        const c = this.flightToBook.conversion;
        return c.USD / c.EUR;
      }
      return (
        this.checkFlightData.conversion.amount / this.checkFlightData.total
      );
    },
    convertToUsd(price) {
      return Math.round(price * this.factor() * 100) / 100;
    },
    book() {
      if (this.bookingProgress) return;
      this.bookingProgress = true;
      this.saveBooking()
        .then(response => {
          if (response.status === 200) {
            $("#booking-success-modal").modal();
          } else {
            $("#booking-failure-modal").modal();
          }
        })
        .finally(() => {
          this.bookingProgress = false;
        });
    },
    goHome() {
      this.$router.push({ name: "overview" });
    }
  },
  computed: {
    ...Vuex.mapGetters(["flightToBook"]),
    passengerCount() {
      if (!this.passengers)
        return { adults: 0, children: 0, infants: 0, pnum: 0 };
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
        exact: this.checkFlightData
          ? this.checkFlightData.flightsChecked
          : false
      };
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
