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
                It looks like you found a great deal! If you choose to book this
                flight it will count as one of your free booking. Once you use
                your free bookings you will have to upgrade to either FlyLine
                Basic or FlyLine Pro to continue saving with FlyLine.
              </p>
            </div>
          </div>
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
          <div class="pform__field--button red">
            <h4>
              To add another passenger upgrade to FlyLine Basic or Pro
            </h4>
          </div>
        </div>

        <div class="summary__right">
          <upgrade-to-plan @selected-plan="selectPlan" />
          <div class="summary__inner">
            <booking-totals
              :prices="prices"
              :count="passengerCount"
              :busy="!flightChecked"
              :selected-plan="selectedPlan"
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
import BookingPage from "./BookingPage";
import UpgradeToPlan from "../components/UpgradeToPlan";

export default {
  delimiters: ["{{", "}}"],
  extends: BookingPage,
  data() {
    return {
      selectedPlan: null
    };
  },
  methods: {
    selectPlan(plan) {
      this.selectedPlan = plan;
    }
  },
  components: {
    UpgradeToPlan
  }
};
</script>
