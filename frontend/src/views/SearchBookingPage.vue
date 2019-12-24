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
          <div class="pform__field--button">
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
