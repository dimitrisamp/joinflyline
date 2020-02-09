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
        <h1 class="wizard__title">Lets log you in</h1>
        <hr>
        <div class="wizard__form">
          <!--  Personal Information -->
          <div class="row">
            <div class="col-12">
              <input type="text" class="wizard__input" placeholder="Email Address" />
            </div>
            <div class="col-12">
              <input type="text" class="wizard__input" placeholder="Password" />
            </div>
            <!-- Submit Button -->
            <div class="col-12">
              <button class="wizard__submit">Log in</button>
            </div>
            <!-- Checkbox -->
            <div class="col-12">
              <div class="wizard__remember-me">
                <label class="control control--checkbox">
                  <span>Remember me</span>
                  <input type="checkbox" />
                  <div class="control__indicator" />
                </label>
                <router-link class="wizard__forget-password" to="/forget-password">Forgot Password?</router-link>
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

export default {
  name: "WizardLogIn",
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