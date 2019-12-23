<template>
  <div class="membership-guest" v-if="plans">
    <span class="membership-guest__back-to-home" @click="logOut($router)">Back to home</span>
    <div class="membership-guest__right">
      <h3 class="membership-guest__heading">Welcome Back Zach!</h3>
      <p class="membership-guest__text">
        You've used your free booking, now it's time to pick a plan
      </p>
      <div
        v-for="(plan, code) in plans"
        class="membership-guest__plan"
        :key="`plan-${code}`"
      >
        <div class="membership-guest__plan-left">
          <h4>FlyLine {{ plan.name }}</h4>
          <h4 class="membership-guest__price">
            ${{ plan.price.value }}<span>/yr</span>
          </h4>
          <button
            type="button"
            @click="selectPlan(code)"
            class="button button-outline--blue"
          >
            Select
          </button>
        </div>
        <div class="membership-guest__plan-right">
          <ul>
            <li>- Flight search and book</li>
            <li>- Auto Check-in</li>
            <li v-if="plan.limit">- Max of {{ plan.limit }} Bookings</li>
            <li v-else>
              - Unlimited Bookings
            </li>
            <li>
              - Access to FlyLine Portal
            </li>
            <li v-if="plan.deal_alerts">
              - Deal alerts
            </li>
            <li v-if="plan.companion">
              <!-- - {{ plans[pk].companion }} companion account{{ plans[pk].companion>1?"s":"" }} -->
              - Companion account
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="membership-guest__left">
      <h3 class="membership-guest__heading">Payment</h3>
      <p class="membership-guest__text membership-guest__text--large">
        Enter your payment info and you're all set
      </p>
      <div class="membership-guest__form">
        <p v-if="selectedPlan">
          FlyLine {{ plans[selectedPlan].name }} - ${{
            plans[selectedPlan].price.value
          }}/yr
        </p>
        <p v-else>No plan selected</p>
        <hr />
        <input
          type="text"
          class="form-control"
          placeholder="Credit Card Number"
          v-model="form.card_number"
        />
        <input
          type="text"
          class="form-control"
          placeholder="Billing Zip"
          v-model="form.zip"
        />
        <div class="form-container">
          <input
            type="text"
            class="form-control"
            placeholder="Exp Date"
            v-model="form.expiry"
          />
          <input
            type="text"
            class="form-control"
            placeholder="CCV"
            v-model="form.cvc"
          />
        </div>
        <label class="control control--checkbox">
          <span
            >Agree FlyLine
            <router-link :to="{ name: 'terms-of-services' }"
              >Terms of Use and Privacy Policy</router-link
            ></span
          >
          <input type="checkbox" v-model="agreeToTerms" />
          <div class="control__indicator" />
        </label>
        <button
          type="button"
          class="button button--big button-outline--blue"
          :disabled="!formComplete"
          @click="submit"
        >
          Buy FlyLine {{ plans[selectedPlan].name }} - ${{
            plans[selectedPlan].price.value
          }}
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import Vuex from "vuex";
import api from "../utils/http";

export default {
  data() {
    return {
      selectedPlan: "basic",
      form: {
        card_number: "",
        expiry: "",
        cvc: "",
        zip: ""
      },
      agreeToTerms: false
    };
  },
  computed: {
    ...Vuex.mapState("plans", ["plans"]),
    formComplete() {
      return (
        this.selectedPlan &&
        this.form.card_number &&
        this.form.expiry &&
        this.form.cvc &&
        this.agreeToTerms
      );
    }
  },
  methods: {
    ...Vuex.mapActions("user", ["initializeUser", "logOut"]),
    selectPlan(code) {
      this.selectedPlan = code;
    },
    submit() {
      if (!this.formComplete) return;
      api
        .post("set-plan/", { ...this.form, plan: this.selectedPlan })
        .then(() => {
          this.initializeUser();
        });
    }
  }
};
</script>
