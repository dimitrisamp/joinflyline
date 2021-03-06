<template>
  <div class="get-started">
    <Header />
    <div class="back-to-home d-none d-md-block">
      <router-link v-if="step === 1" :to="{ name: 'index' }"
        >Back to Home</router-link
      >
      <a v-if="step === 2" href="#" @click.prevent="prevStep">Back to Step 1</a>
    </div>
    <section v-if="step === 1" class="step-2">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-5 col-sm-12 col-12 sm-12">
            <div class="step-formbg onborad1-form">
              <div class="form-logo text-center">
                <img src="@/assets/img/flyline_logos-01-1.png" />
              </div>

              <div
                class="form-descrption step-01 text-center"
                v-if="displayForm"
              >
                <div><strong>Let's start your free trial</strong></div>
                <div>
                  <span v-if="inviteMode"
                    >Sign Up for your companion account</span
                  >
                </div>
                <span>Step {{ step }} of 2</span>
                <p>Enter your information to get started</p>
              </div>
              <div
                class="form-descrption step-01 text-center"
                v-else-if="inviteCodeCheckProgress"
              >
                <div><strong>Checking your invite code...</strong></div>
              </div>
              <div
                class="form-descrption step-01 text-center"
                v-else-if="inviteCodeRejected"
              >
                <div><strong>Your invite code was not found</strong></div>
              </div>
              <div v-else-if="activationCodeCheckProgress">
                <div><strong>Checking your activation code...</strong></div>
              </div>
              <div v-else-if="activationCodeRejected">
                <div><strong>Your activation code was not found</strong></div>
              </div>
              <template v-if="displayForm">
                <div class="form-group form-group step-f-inputs">
                  <location-input
                    :prompt="'Home Airport'"
                    :prompt-mobile="'Home Airport'"
                    :prompt-mobile-focus="'Home Airport'"
                    :search-type="'city'"
                    :initial-value="form.home_airport"
                    @place-selected="updatePlaceFrom"
                  />
                </div>

                <div class="form-group  step-f-inputs">
                  <input
                    type="text"
                    class="form-control"
                    :class="{ 'email-exists': emailExists }"
                    name="email"
                    @keyup.enter="focusElement('password')"
                    @keyup="onEmailChange"
                    placeholder="Email Address"
                    v-model="form.email"
                    :disabled="inviteMode || activationMode"
                  />
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
                </div>

                <div class="form-group form-group  step-f-inputs">
                  <input
                    type="password"
                    class="form-control"
                    name="password"
                    placeholder="Password"
                    v-model="form.password"
                    @keyup.enter="nextStep"
                  />
                </div>

                <div class="form-group step-f-inputs">
                  <button
                    type="button"
                    class="btn btn-default"
                    @click="nextStep"
                    :disabled="!isStep1Complete"
                  >
                    Continue
                  </button>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section v-if="step === 2" class="step-2">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-6 col-sm-12 sm-12 col-12">
            <div class="step-formbg">
              <div id="navbar-progress">
                <div
                  id="navbar-progress-indicator"
                  :class="{ busy: requestSent || promoCheckProgress }"
                ></div>
              </div>
              <div class="form-logo text-center">
                <img src="@/assets/img/flyline_logos-01-1.png" />
              </div>
              <div v-if="subscribeRequestFailed">
                <div>
                  <strong>{{ subscribeRequestErrorMessage }}</strong>
                </div>
              </div>

              <div class="form-descrption text-center">
                <div><strong>Lets Get Started</strong></div>
                <span>Step {{ step }} of 2</span>
                <p>
                  - Cancel before
                  <span class="highlighted">{{ trialDueDate }}</span> to not be
                  charged
                </p>
                <p>
                  - As a reminder we'll email you
                  <span class="highlighted">3 days</span> before.
                </p>
                <p>
                  - No commitments. <span class="highlighted">Cancel</span> at
                  anytime
                </p>
              </div>

              <div class="form-group  step-f-inputs">
                <input
                  type="text"
                  class="form-control"
                  placeholder="First Name"
                  name="first_name"
                  @keyup.enter="focusElement('last_name')"
                  v-model="form.first_name"
                />
              </div>

              <div class="form-group  step-f-inputs">
                <input
                  type="text"
                  class="form-control"
                  name="last_name"
                  placeholder="Last Name"
                  v-model="form.last_name"
                />
              </div>
              <template v-if="!inviteMode && !activationMode">
                <div class="form-group form-group-sm step-f-inputs">
                  <dynamic-select
                    class="form-control"
                    name="plan"
                    :discount="discount"
                    v-model="form.plan"
                    @data-arrived="updateSelectValue"
                  />
                </div>
                <template v-if="form.plan !== 'free'">
                  <div class="form-group  step-f-inputs">
                    <input
                      type="text"
                      class="form-control"
                      :class="{ invalid: promoInvalid }"
                      placeholder="Promo Code"
                      @keyup.enter="focusElement('zip')"
                      name="promo_code"
                      @input="checkPromo"
                      v-model="form.promo_code"
                    />
                  </div>

                  <div class="form-group step-f-inputs">
                    <input
                      type="text"
                      class="form-control"
                      @keyup.enter="focusElement('card_number')"
                      name="zip"
                      placeholder="Billing Zip"
                      v-model="form.zip"
                    />
                  </div>

                  <div class="form-group  step-f-inputs">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Credit Card Number"
                      @keyup.enter="focusElement('expiry')"
                      name="card_number"
                      v-model="form.card_number"
                    />
                  </div>

                  <div class="row">
                    <div class="form-group  step-f-inputs col-6">
                      <input
                        type="text"
                        class="form-control"
                        @keyup.enter="focusElement('cvc')"
                        name="expiry"
                        placeholder="Exp Date"
                        v-model="form.expiry"
                      />
                    </div>

                    <div class="form-group  step-f-inputs col-6">
                      <input
                        type="text"
                        class="form-control"
                        name="cvc"
                        @keyup.enter="submit()"
                        placeholder="CCV Code"
                        v-model="form.cvc"
                      />
                    </div>
                  </div>
                </template>
              </template>

              <div class="form-group step-f-inputs">
                <button
                  type="button"
                  class="btn btn-default"
                  :disabled="!isStep2Complete || requestSent"
                  @click="submit"
                >
                  Get started
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <simple-footer />
  </div>
</template>

<script>
import api from "../utils/http";
import { debounce } from "../utils/utils";
import DynamicSelect from "../components/DynamicSelect";
import LocationInput from "../components/LocationInput";
import Header from "../components/Header";
import SimpleFooter from "../components/SimpleFooter";
import Vuex from "vuex";
import Vue from "vue";
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
  components: {
    LocationInput,
    DynamicSelect,
    Header,
    SimpleFooter
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
        activation_code: this.$route.query.activation_code || null,
        terms_agree: false
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
      subscribeRequestFailed: false,
      subscribeRequestErrorMessage: "",
      mode: this.$route.query.hasOwnProperty("code")
        ? Mode.INVITE
        : this.$route.query.hasOwnProperty("activation_code")
        ? Mode.ACTIVATE
        : Mode.SIGNUP,
      Mode
    };
  },
  created() {
    if (this.inviteMode) {
      this.checkInvite();
    } else if (this.activationMode) {
      this.checkActivationCode();
    }
  },
  delimiters: ["{{", "}}"],
  watch: {
    step: function(val) {
      Vue.nextTick().then(() => {
        if (val === 2) this.focusElement("first_name");
      });
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
        api
          .post(this.getPostUrl(), this.form)
          .then(response => {
            const data = response.data;
            if (data.success) {
              this.authenticate({
                email: this.form.email,
                password: this.form.password,
                router: this.$router,
                name: "account"
              });
            }
          })
          .catch(reason => {
            this.subscribeRequestFailed = true;
            if (reason.response) {
              this.subscribeRequestErrorMessage = reason.response.data.message;
            }
          })
          .finally(() => {
            this.requestSent = false;
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
  }
};
</script>
