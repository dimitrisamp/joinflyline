<template>
  <div class="wizard wizard--login">
    <div class="wizard__sidebar">
      <div class="wizard__logo">
        <img src="@/assets/images/wizard-logo.svg" alt="Logo" />
      </div>
      <wizard-slider :slides="slides" />
    </div>
    <div class="wizard__content">
      <div class="wizard__top">
        <router-link to="/" class="wizard__goback">Back Home</router-link>
        <span
          >Don’t have an account?
          <router-link to="/login">Start 14 Day Free Trial</router-link></span
        >
      </div>
      <div class="wizard__bottom">
        <h1 class="wizard__title">Lets log you in</h1>
        <hr />
        <div class="wizard__form">
          <!--  Personal Information -->
          <div class="row">
            <div class="col-12">
              <input
                type="text"
                v-model="email"
                class="wizard__input"
                placeholder="Email Address"
              />
            </div>
            <div class="col-12">
              <input
                type="password"
                v-model="password"
                class="wizard__input"
                placeholder="Password"
              />
            </div>
            <!-- Submit Button -->
            <div class="col-12">
              <button
                type="button"
                @click="handleSubmit"
                class="wizard__submit"
              >
                Log in
              </button>
            </div>
            <!-- Checkbox -->
            <div class="col-12">
              <div class="wizard__remember-me">
                <label class="control control--checkbox">
                  <span>Remember me</span>
                  <input type="checkbox" />
                  <div class="control__indicator" />
                </label>
                <router-link
                  class="wizard__forget-password"
                  :to="{ name: 'password-reset' }"
                  >Forgot Password?</router-link
                >
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

export default {
  name: "WizardLogIn",
  components: {
    WizardSlider
  },
  data() {
    return {
      email: "",
      password: "",
      hasError: false,
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
    ...Vuex.mapActions("user", ["authenticate", "clearStatus"]),
    handleSubmit() {
      if (this.email && this.password) {
        this.authenticate({
          email: this.email,
          password: this.password,
          router: this.$router,
          name: "overview"
        });
      } else {
        this.hasError = true;
      }
    }
  },
  computed: {
    ...Vuex.mapState("user", ["authErrorText"])
  }
};
</script>

<style lang="scss" scoped>
@import "src/assets/styles/mixins/mq";
@import "src/assets/styles/components/wizard-login";
</style>
