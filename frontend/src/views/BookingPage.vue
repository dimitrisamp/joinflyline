<template>
  <div class="booking-page">
    <div class="booking-page__header">
      <h3 class="header__title">
        {{ flightToBook.cityFrom }}
        <span class="fa fa-long-arrow-right" /> {{ flightToBook.cityTo }}
        <span v-if="flightToBook.roundtrip">and back</span>
      </h3>
      <p class="header__description">
        Confirm your trip details, enter your traveler information, and input
        your payment details to complete your booking.
      </p>
    </div>
    <div class="main-padding">
      <div class="summary__container">
        <div class="summary__left">
          <trip-summary />
          <div
            class="passenger"
            v-for="(passenger, i) in passengers"
            :key="`passenger-${i}`"
          >
            <booking-passenger-form
              :check-flight-data="checkFlightData"
              :passenger="passenger"
              :passenger-index="i"
              :convert-to-usd="convertToUsd"
              @passenger-updated="updatePassenger(i, ...arguments)"
            />
          </div>
          <div class="pform__field--button">
            <button
              class="pform__add button button--big button--outline-blue"
              @click="addPassenger"
            >
              Add another passenger
            </button>
          </div>
        </div>

        <div class="summary__right">
          <div class="summary__inner">
            <booking-totals
              :prices="prices"
              :count="passengerCount"
              :busy="!flightChecked"
            />
            <checkout-form
              :form="form"
              :total_price="prices.total"
              :booking-progress="bookingProgress"
              :can-book="canBook()"
              :email-exists="emailExists"
              @book="book"
            />
          </div>
        </div>
      </div>
    </div>
    <booking-popup
      v-if="bookingSuccess"
      title="Booking Confirmed"
      body="Congrats! Your flight is booked, we'll send an email confirmation shortly."
      button-label="Close"
      @button-click="goHome"
    />
    <booking-popup
      v-if="bookingFailure"
      title="Booking Error"
      body="There seemed to be an error when booking your flight, try again or contact FlyLine support, support@joinflyline.com"
      button-label="Close"
      @button-click="closeBookingError"
    />
    <booking-popup
      v-if="flightInvalid"
      title="Flight is invalid"
      body="Sorry, seems like the flight does not exist. Please choose another one."
      button-label="Back"
      @button-click="$router.go(-1)"
    />
  </div>
</template>

<script>
import { getAgeCategory, validateCardNumber } from "../utils/utils";
import api from "../utils/http";
import moment from "moment";
import Vuex from "vuex";
import BookingPassengerForm from "../components/BookingPassengerForm";
import BookingTotals from "../components/BookingTotals";
import CheckoutForm from "../components/CheckoutForm";
import TripSummary from "../components/TripSummary";
import BookingPopup from "../components/BookingPopup";

const checkInterval = 60000;

const checkFlightsApiUrl = "/booking/check_flights/";

const saveBookingApiUrl = "/book/";

const sampleAge = {
  adults: 20,
  children: 10,
  infants: 1
};

const genderToTitle = { 0: "mr", 1: "ms" };

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
      cardno: user_data.passport_number
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
      title: 0
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
    title: genderToTitle[user.gender] || 0,
    passport_number: user.passport_number
  };
}

function makeDate(y, m, d) {
  const date = moment(
    `${y}-${m.toString().padStart(2, "0")}-${d
      .toString()
      .padStart(2, "0")} 00:00`
  );
  if (date._isValid) return date;
  return null;
}

export default {
  delimiters: ["{{", "}}"],
  components: {
    TripSummary,
    BookingPassengerForm,
    BookingTotals,
    CheckoutForm,
    BookingPopup
  },
  data() {
    let seats = {
      ...this.$store.getters["search/flightToBook"].parent.search_params.seats
    };
    let user = {
      ...this.$store.getters["user/user"]
    };
    delete seats.passengers;
    let initialPassengers = [];
    if (seats.adults > 0) {
      seats.adults = seats.adults - 1;
      if (!user.anonymous) {
        initialPassengers.push(
          makePassenger(true, "adults", formatUserData(user))
        );
      } else {
        initialPassengers.push(makePassenger(true, "adults"));
      }
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
      bookingProgress: false,
      emailCheckProgress: false,
      emailVerified: true,
      emailExists: false,
      bookingSuccess: false,
      bookingFailure: false
    };
  },
  watch: {
    "form.email": {
      handler() {
        if (this.emailCheckProgress) return;
        if (this.user.anonymous) {
          this.emailVerified = false;
          this.emailCheckProgress = true;
          api
            .get("auth/check-user/", { params: { email: this.form.email } })
            .then(response => {
              const data = response.data;
              this.emailExists = data.exists;
              this.emailVerified = true;
              this.emailCheckProgress = false;
            });
        }
      }
    },
    formState: {
      handler() {
        this.flightChecked = false;
        this.checkFlight();
      },
      deep: true
    }
  },
  methods: {
    closeBookingError() {
      this.bookingFailure = false;
    },
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
          birthday: makeDate(p.year, p.month, p.day),
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
          retail_info: this.flightToBook,
          searchForm: this.searchForm
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
    formValid() {
      if (this.form.holder_name.length === 0) return false;
      if (!validateCardNumber(this.form.card_number)) return false;
      const today = new Date();
      try {
        let [month, year] = this.form.expiry.split("/").map(parseInt);
        year += 2000;
        if (today.getFullYear() > year) return false;
        if (today.getFullYear() === year && today.getMonth() + 1 > month)
          return false;
      } catch {
        return false;
      }
      if (!this.form.credit_card_cvv.match(/\d{3,4}/)) return false;
      if (!this.form.email.includes("@")) return false;
      return true;
    },
    passengersValid() {
      for (const p of this.passengersParameter()) {
        if (p.birthday === null) {
          return false;
        }
        if (!p.name || p.name.length === 0) return false;
        if (!p.surname || p.surname.length === 0) return false;
        if (!p.nationality || p.nationality.length === 0) return false;
        if (!["mr", "ms"].includes(p.title)) return false;
        if (!p.cardno || p.cardno.length === 0) return false;
        if (!p.expiration || p.expiration.length === 0) return false;
      }
      return true;
    },
    canBook() {
      return (
        !this.bookingProgress &&
        this.flightChecked &&
        this.passengersValid() &&
        this.formValid() &&
        !this.emailExists
      );
    },
    book() {
      if (!this.canBook()) return;
      this.bookingProgress = true;
      this.saveBooking()
        .then(() => {
          this.bookingSuccess = true;
        })
        .catch(() => {
          this.bookingFailure = true;
        })
        .finally(() => {
          this.bookingProgress = false;
        });
    },
    goHome() {
      if (this.user.anonymous) {
        this.$router.push({ name: "index" });
      } else {
        this.$router.push({ name: "overview" });
      }
    }
  },
  computed: {
    ...Vuex.mapGetters("search", ["flightToBook"]),
    ...Vuex.mapState("user", ["user"]),
    ...Vuex.mapState("search", { searchForm: "form" }),
    passengerCount() {
      if (!this.passengers)
        return { adults: 0, children: 0, infants: 0, pnum: 0 };
      const categories = this.passengers.map(getAgeCategory);
      const counter = categories.reduce(
        (c, val) => c.set(val, 1 + (c.get(val) || 0)),
        new Map([
          ["infants", 0],
          ["children", 0],
          ["adults", 0]
        ])
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
};
</script>
