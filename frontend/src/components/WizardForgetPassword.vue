<template>
  <div class="wizard wizard--login">
    <div class="wizard__sidebar">
      <div class="wizard__logo">
        <img src="@/assets/images/wizard-logo.svg" alt="Logo">
      </div>
      <wizard-slider :slides="slides" />
    </div>
    <div class="wizard__content">
      <div class="wizard__top">
        <router-link to="/" class="wizard__goback">Back Home</router-link>
        <span>Don’t have an account? <router-link to="/login">Start 14 Day Free Trial</router-link></span>
      </div>
      <div class="wizard__bottom">
        <h1 class="wizard__title">Forget your password?</h1>
        <p class="wizard__info">Not a problem, enter your email and we’ll send you a link to reset</p>
        <div class="wizard__form">
          <!--  Personal Information -->
          <div class="row">
            <div class="col-12">
              <input type="text" class="wizard__input" placeholder="Email Address" />
            </div>
            <!-- Submit Button -->
            <div class="col-12">
              <button class="wizard__submit">Send Reset Instructions</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WizardSlider from "./WizardSlider";

export default {
  name: "WizardForgetPassword",
  components: {
    WizardSlider
  },
  data() {
    return {
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
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/styles/mixins/mq";
@import "src/assets/styles/components/wizard-login";
</style>