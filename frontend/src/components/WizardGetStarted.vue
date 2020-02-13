<template>
  <div class="wizard wizard--get-started">
    <div class="wizard__sidebar">
      <div class="wizard__logo">
        <img src="@/assets/images/wizard-logo.svg" alt="Logo" />
      </div>
      <wizard-slider :slides="slides" />
    </div>
    <div class="wizard__content">
      <div class="wizard__top">
        <router-link :to="{ name: 'index'}" class="wizard__goback">Back Home</router-link>
        <span
          >Already a member? <router-link :to="{name: 'sign-in'}">Log in</router-link></span
        >
      </div>
      <div class="wizard__bottom">
        <h1 class="wizard__title">Lets Get Started</h1>
        <p class="wizard__info">
          Enter a few details to start your 14 day free trial of FlyLine. You
          won’t be charged until the completion of your trial and if your travel
          plans change feel free to cancel at any time
        </p>

        <div class="wizard__form">
          <!--  Personal Information -->
          <div class="row">
            <div class="col-12 col-lg-6">
              <input
                type="text"
                class="wizard__input"
                name="first_name"
                v-model="form.first_name"
                @keyup.enter="focusElement('last_name')"
                placeholder="First Name"
              />
            </div>
            <div class="col-12 col-lg-6">
              <input
                type="text"
                name="last_name"
                v-model="form.last_name"
                @keyup.enter="focusElement('email')"
                class="wizard__input"
                placeholder="Last Name"
              />
            </div>
            <div class="col-12 col-lg-6">
              <small
                v-if="emailVerified && emailExists"
                class="form-text text-danger"
                >User with that email is already registered. Is that you?
                <router-link :to="{ name: 'sign-in' }"
                  >Sign In</router-link
                ></small
              >
              <small v-if="emailInvalid" class="form-text text-danger"
                >Email is invalid</small
              >
              <input
                type="email"
                name="email"
                v-model="form.email"
                @keyup.enter="focusElement('password')"
                class="wizard__input"
                placeholder="Email Address"
              />
            </div>
            <div class="col-12 col-lg-6">
              <input
                name="password"
                v-model="form.password"
                type="password"
                @keyup.enter="focusElement('home_airport')"
                class="wizard__input"
                placeholder="Password"
              />
            </div>
            <div class="col-12 col-lg-6">
              <location-input
                is-wide
                type="text"
                name="home_airport"
                v-model="form.home_airport"
                @keyup.enter="focusElement('plan')"
                input-class="wizard__input"
                placeholder="Home Airport"
                @place-selected="updatePlaceFrom"
              />
            </div>
            <div class="col-12 col-lg-6">
              <dynamic-select
                name="plan"
                v-model="form.plan"
                @data-arrived="updateSelectValue"
                class="wizard__input"
              />
            </div>
          </div>
          <!--  Payment Information -->
          <div class="wizard-payment">
            <div class="wizard-payment__heading">
              <h5 class="wizard-payment__title">Payment Information</h5>
              <p class="wizard-payment__text">
                We will send you an email reminder 3 days before your trial ends
              </p>
            </div>
            <div class="row">
              <div class="col-12 col-lg-6">
                <input
                  type="text"
                  name="promo_code"
                  v-model="form.promo_code"
                  @keyup.enter="focusElement('zip')"
                  class="wizard__input"
                  placeholder="Promo Code"
                />
              </div>
              <div class="col-12 col-lg-6">
                <input
                  type="text"
                  class="wizard__input"
                  name="zip"
                  v-model="form.zip"
                  @keyup.enter="focusElement('card_number')"
                  placeholder="Billing Zip"
                />
              </div>
              <div class="col-12 col-lg-6">
                <input
                  type="email"
                  class="wizard__input"
                  placeholder="Credut Card Number"
                  name="card_number"
                  v-model="form.card_number"
                  @keyup.enter="focusElement('expiry')"
                />
              </div>
              <div class="col-12 col-lg-6">
                <div class="row">
                  <div class="col-12 col-lg-6">
                    <input
                      type="text"
                      class="wizard__input"
                      placeholder="Exp Date"
                      name="expiry"
                      v-model="form.expiry"
                      @keyup.enter="focusElement('cvc')"
                    />
                  </div>
                  <div class="col-12 col-lg-6">
                    <input
                      type="text"
                      class="wizard__input"
                      placeholder="CCV"
                      name="cvc"
                      v-model="form.cvc"
                      @keyup.enter="focusElement('terms_agree')"
                    />
                  </div>
                </div>
              </div>
              <!-- Checkbox -->
              <div class="col-12">
                <label class="control control--checkbox">
                  <span
                    >By creating a FlyLine account you agree with our
                    <router-link to="/">Terms of Use </router-link> and
                    <router-link to="/">Privacy Policy</router-link></span
                  >
                  <input
                    type="checkbox"
                    name="terms_agree"
                    v-model="form.terms_agree"
                  />
                  <div class="control__indicator" />
                </label>
              </div>
              <!-- Submit Button -->
              <div class="col-12">
                <button class="wizard__submit" type="button" @click="submit">
                  Start 14 Day Free Trial
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WizardSlider from "./WizardSlider";
import Vuex from "vuex";
import { debounce } from "../utils/utils";
import api from "../utils/http";
import Vue from "vue";
import LocationInput from "./LocationInput";
import DynamicSelect from "./DynamicSelect";
import moment from "moment";

const Mode = {
  SIGNUP: 0,
  INVITE: 1,
  ACTIVATE: 2
};

const urls = {
  [Mode.SIGNUP]: "/get-started/",
  [Mode.INVITE]: "/get-started-companion/",
  [Mode.ACTIVATE]: "/get-started-activation/"
};

export default {
  name: "WizardGetStarted",
  components: {
    DynamicSelect,
    WizardSlider,
    LocationInput
  },
  metaInfo: {
    title: "Get Started | FlyLine"
  },
  data() {
    return {
      step: 1,
      emailExists: false,
      emailVerified: false,
      requestSent: false,
      form: {
        home_airport: null,
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        promo_code: "",
        zip: "",
        card_number: "",
        expiry: "",
        cvc: "",
        plan: "basic",
        code: this.$route.query.code || null,
        activation_code: this.$route.query.activation_code || null
      },
      inviteMode: this.$route.query.hasOwnProperty("code"),
      activationMode: this.$route.query.hasOwnProperty("activation_code"),
      activation: null,
      activationCodeCheckProgress: false,
      activationCodeRejected: false,
      invite: null,
      inviteCodeCheckProgress: false,
      inviteCodeRejected: false,
      discount: null,
      promoCheckProgress: false,
      promoInvalid: false,
      mode: this.$route.query.hasOwnProperty("code")
        ? Mode.INVITE
        : this.$route.query.hasOwnProperty("activation_code")
        ? Mode.ACTIVATE
        : Mode.SIGNUP,
      Mode,
      slides: [
        {
          id: 1,
          title: "Stop Paying Retail",
          text:
            "We source flights from 250+ airlines and sell them directly to you with zero markup.",
          imgUrl: "wizard-slide-bg.jpg",
          imgAlt: "Hawaii"
        },
        {
          id: 2,
          title: "Stop Paying Retail 2",
          text:
            "We source flights from 250+ airlines and sell them directly to you with zero markup.",
          imgUrl: "wizard-slide-bg.jpg",
          imgAlt: "Hawaii"
        },
        {
          id: 3,
          title: "Stop Paying Retail 3",
          text:
            "We source flights from 250+ airlines and sell them directly to you with zero markup.",
          imgUrl: "wizard-slide-bg.jpg",
          imgAlt: "Hawaii"
        }
      ]
    };
  },
  created() {
    if (this.inviteMode) {
      this.checkInvite();
    } else if (this.activationMode) {
      this.checkActivationCode();
    }
  },
  methods: {
    ...Vuex.mapActions("user", ["authenticate"]),
    prevStep() {
      this.step = 1;
    },
    nextStep() {
      if (this.emailVerified && this.isStep1Complete) {
        this.step = 2;
        return;
      }
      let that = this;
      this.verifyEmail(() => {
        if (that.emailVerified) {
          that.step = 2;
        }
      });
    },
    checkPromo: debounce(function() {
      if (this.promoCheckProgress) setTimeout(this.checkPromo, 500);
      const promo = this.form.promo_code;
      if (promo.length === 0) {
        this.promoInvalid = false;
        return;
      }
      this.promoCheckProgress = true;
      api
        .get("subscriptions/check-promo", { params: { promocode: promo } })
        .then(response => {
          this.discount = response.data.discount;
          this.promoInvalid = false;
        })
        .catch(() => {
          this.promoInvalid = true;
        })
        .finally(() => {
          this.promoCheckProgress = false;
        });
    }, 500),
    checkInvite() {
      this.inviteCodeCheckProgress = true;
      api
        .get("check-invite/", { params: { code: this.form.code } })
        .then(response => {
          this.invite = response.data;
          this.form.email = response.data.email;
        })
        .catch(() => {
          this.inviteCodeRejected = true;
        })
        .finally(() => {
          this.inviteCodeCheckProgress = false;
        });
    },
    checkActivationCode() {
      this.activationCodeCheckProgress = true;
      api
        .get("check-activation-code/", {
          params: { activation_code: this.form.activation_code }
        })
        .then(response => {
          this.activation = response.data;
          const data = response.data;
          this.form.home_airport = data.market;
          this.form.email = data.email;
          this.form.first_name = data.first_name;
          this.form.last_name = data.last_name;
          this.form.zip = data.zip;
        })
        .catch(() => {
          this.activationCodeRejected = true;
        })
        .finally(() => {
          this.activationCodeCheckProgress = false;
        });
    },
    verifyEmail(callback) {
      if (this.emailInvalid) return;
      api
        .get("auth/check-user/", { params: { email: this.form.email } })
        .then(response => {
          const data = response.data;
          this.emailExists = data.exists;
          this.emailVerified = true;
          if (callback) callback();
        });
    },
    onEmailChange() {
      this.emailVerified = false;
      this.verifyEmail();
    },
    focusElement(name) {
      const el = document.querySelector(`[name=${name}]`);
      el.focus();
      el.select();
    },
    updateSelectValue(value) {
      this.form.plan = this.$route.params.plan || value;
    },
    updatePlaceFrom(value) {
      this.form.home_airport = value;
    },
    getPostUrl() {
      return urls[this.mode];
    },
    submit() {
      if (!this.isStep2Complete) return;
      this.requestSent = true;
      Vue.nextTick().then(() => {
        api.post(this.getPostUrl(), this.form).then(response => {
          const data = response.data;
          if (data.success) {
            this.authenticate({
              email: this.form.email,
              password: this.form.password,
              router: this.$router,
              name: "account"
            });
          } else {
            window.alert(JSON.stringify(data));
          }
        });
      });
    }
  },
  computed: {
    trialDueDate() {
      return moment()
        .add(14, "days")
        .format("M/D/Y");
    },
    emailInvalid() {
      return this.form.email.length > 0 && !this.form.email.includes("@");
    },
    displayForm() {
      if (!this.inviteMode && !this.activationMode) return true;
      if (this.inviteCodeCheckProgress || this.activationCodeCheckProgress)
        return false;
      if (this.invite || this.activation) return true;
      return false;
    },
    isStep1Complete() {
      return (
        this.form.home_airport !== "" &&
        this.form.email !== "" &&
        this.form.password !== "" &&
        !this.emailExists
      );
    },
    isStep2Complete() {
      if (this.mode !== Mode.SIGNUP) {
        return this.form.first_name !== "" && this.form.last_name !== "";
      }
      return (
        this.form.first_name !== "" &&
        this.form.last_name !== "" &&
        this.form.card_number !== "" &&
        this.form.expiry !== "" &&
        this.form.cvc !== "" &&
        !this.promoCheckProgress
      );
    }
  },
};
</script>

<style lang="scss">
@import "src/assets/styles/mixins/mq";
@import "src/assets/styles/components/wizard-get-started";
</style>
