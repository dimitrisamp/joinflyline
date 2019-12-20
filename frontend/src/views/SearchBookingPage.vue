<template>
  <div class="booking-page">
    <div class="main-padding">
      <div class="summary__container">
        <div class="summary__left">
          <div class="summary__inner">
            <h3 class="summary__heading">
              Congrats, you found a great deal!
            </h3>
            <!-- Flights -->
            <div class="summary__flights">
              <p>
                  It looks like you found a great deal! If you choose to book this flight it will count as one of your free booking. Once you use your free bookings you will have to upgrade to either FlyLine Basic or FlyLine Pro to continue saving with FlyLine.
              </p>
            </div>
          </div>
          <div class="summary__inner">
            <h3 class="summary__heading">
              Trip Summary
              <span
                >{{ flightToBook.nightsInDest }} Night{{
                  flightToBook.nightsInDest > 1 ? "s" : ""
                }}
                Stay in {{ flightToBook.cityTo }}</span
              >
            </h3>
            <!-- Flights -->
            <div class="summary__flights">
              <div class="row">
                <div class="col-12 col-md-6">
                  <div class="summary__departure">
                    <h3 class="box-title">Departure</h3>
                    <booking-flight-details
                      v-for="flight in departureFlights"
                      :key="flight.id"
                      :flight="flight"
                    />
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="summary__return">
                    <h3 class="box-title">Return</h3>
                    <booking-flight-details
                      v-for="flight in returnFlights"
                      :key="flight.id"
                      :flight="flight"
                    />
                  </div>
                </div>
              </div>
            </div>
            <!-- End flights -->
          </div>
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
            <h4>
                To add another passanger upgrade to FlyLine Basic or Pro
            </h4>
          </div>
        </div>

        <div class="summary__right">

          <div class="summary__inner">
            <div class="summary__inner__totals">
                <h3 class="summary__inner__totals__heading">Upgrade to FlyLine Basic or Pro</h3>
                <p>Get the most out of FlyLine and save when upgrading to FlyLine Basic or Pro</p>
                <div class="summary__inner__totals__item">
                    <label class="control control--checkbox"
                        @click="clickUpgrade('basic')"
                    >
                        <span>
                            <h3>FlyLine Basic $39/yr</h3>
                            <br>- Flight Search & Book
                            <br>- Max of 6 bookings
                            <br>- Access to FlyLine Portal
                            <br>- Deal Alerts
                        </span>
                        <div
                        class="control__indicator"
                        :class="{ checked: upgradeBasic }"
                        ></div>
                    </label>
                </div>
                <div class="summary__inner__totals__item">
                    <label class="control control--checkbox"
                        @click="clickUpgrade('pro')"
                    >
                        <span>
                            <h3>FlyLine Pro $139/yr</h3>
                            <br>- Flight Search & Book
                            <br>- Unlimited Bookings
                            <br>- Access to FlyLine Portal
                            <br>- Deal Alerts
                            <br>- Companion Account
                        </span>
                        <div
                        class="control__indicator"
                        :class="{ checked: upgradePro }"
                        ></div>
                    </label>
                </div>
            </div>
          </div>
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
              @book="book"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal fade"
      id="booking-success-modal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              Booking Confirmed
            </h5>
            <button class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <h1>
              Congrats! Your flight is booked, we'll send an email confirmation
              shortly.
            </h1>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
              @click="goHome"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal fade"
      id="booking-failure-modal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Booking Error</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <h1>
              There seemed to be an error when booking your flight, try again or
              contact Wanderift support, support@wanderift.com
            </h1>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal fade"
      id="flight-invalid-modal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              Flight is invalid
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <h1>
              Sorry, seems like the flight does not exist. Please choose another
              one.
            </h1>
          </div>
          <div class="modal-footer">
            <button
              @click="$router.go(-1)"
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAgeCategory, validateCardNumber } from "../utils/utils";
import api from "../utils/http";
import moment from "moment";
import Vuex from "vuex";
import $ from "jquery";
import BookingFlightDetails from "../components/BookingFlightDetails";
import BookingPassengerForm from "../components/BookingPassengerForm";
import BookingTotals from "../components/BookingTotals";
import CheckoutForm from "../components/CheckoutForm";

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
    BookingFlightDetails,
    BookingPassengerForm,
    BookingTotals,
    CheckoutForm
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
      initialPassengers.push(
        makePassenger(true, "adults", formatUserData(user))
      );
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
      upgradeBasic: false,
      upgradePro: false
    };
  },
  watch: {
    formState: {
      handler() {
        this.flightChecked = false;
        this.checkFlight();
      },
      deep: true
    },
    flightInvalid: {
      handler(value) {
        if (value) {
          $("#booking-success-modal").modal();
        }
      }
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
      for (let [passenger, passengerIndex] of this.passengers) {
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
        this.formValid()
      );
    },
    book() {
      if (!this.canBook()) return;
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
    },
    clickUpgrade(type){
        if(type == "basic"){
            this.upgradeBasic = !this.upgradeBasic;
        }
        if(type == "pro"){
            this.upgradePro = !this.upgradePro;
        }
    }
  },
  computed: {
    ...Vuex.mapGetters("search", ["flightToBook"]),
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
    },
    returnFlights() {
      return this.flightToBook.route.filter(o => o.return === 1);
    },
    departureFlights() {
      return this.flightToBook.route.filter(o => o.return === 0);
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
