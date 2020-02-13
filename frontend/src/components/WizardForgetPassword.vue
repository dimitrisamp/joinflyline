<template>
  <div class="wizard wizard--login">
    <div class="wizard__sidebar">
      <div class="wizard__logo">
        <img src="@/assets/images/wizard-logo.svg" alt="Logo" />
      </div>
      <wizard-slider :slides="slides" />
    </div>
    <div v-if="step === 1" class="wizard__content">
      <div class="wizard__top">
        <router-link :to="{ name: 'index' }" class="wizard__goback"
          >Back Home</router-link
        >
        <span
          >Don’t have an account?
          <router-link :to="{ name: 'get-started' }"
            >Start 14-day free trial</router-link
          ></span
        >
      </div>
      <div class="wizard__bottom">
        <h1 class="wizard__title">Forget your password?</h1>
        <p class="wizard__info">
          Not a problem, enter your email and we’ll send you a link to reset
        </p>
        <div class="wizard__form">
          <!--  Personal Information -->
          <div class="row">
            <div class="col-12">
              <small v-if="emailInvalid" class="form-text text-danger"
                >Email is invalid</small
              >
              <small v-if="userNotFound" class="form-text text-danger"
                >User not found</small
              >
              <input
                type="text"
                class="wizard__input"
                placeholder="Email Address"
                v-model="form.email"
              />
            </div>
            <!-- Submit Button -->
            <div class="col-12">
              <button
                type="button"
                @click="submit()"
                :disabled="!isStep1Complete"
                class="wizard__submit"
              >
                Send Reset Instructions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="step === 2" class="wizard__content">
      <div class="wizard__top">
        <router-link to="/" class="wizard__goback">Back Home</router-link>
      </div>
      <div class="wizard__bottom">
        <h1 class="wizard__title">Check your inbox</h1>
        <p class="wizard__info">
          We've sent you email with instructions to reset your password.
        </p>
        <div class="wizard__form">
          <!--  Personal Information -->
          <div class="row">
            <div class="col-12">
              <router-link :to="{ name: 'index' }" class="wizard__submit">
                Back to home
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WizardSlider from "./WizardSlider";
import api from "../utils/http";

export default {
  name: "WizardForgetPassword",
  components: {
    WizardSlider
  },
  metaInfo: {
    title: "Reset password | FlyLine"
  },
  data() {
    return {
      step: 1,
      requestSent: false,
      form: {
        email: ""
      },
      userNotFound: false,
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
  methods: {
    submit() {
      if (this.requestSent) return;
      this.requestSent = true;
      api
        .post("password_reset/", { email: this.form.email })
        .then(() => {
          this.step = 2;
        })
        .catch(() => {
          this.userNotFound = true;
        })
        .finally(() => {
          this.requestSent = false;
        });
    }
  },
  computed: {
    emailInvalid() {
      return this.form.email.length > 0 && !this.form.email.includes("@");
    },
    isStep1Complete() {
      return this.form.email !== "" && !this.emailInvalid;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/assets/styles/mixins/mq";
@import "src/assets/styles/components/wizard-login";
</style>
