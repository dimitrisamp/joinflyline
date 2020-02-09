<template>
  <div class="wizard wizard--get-started">
    <div class="wizard__sidebar">
      <div class="wizard__logo">
        <img src="@/assets/images/wizard-logo.svg" alt="Logo">
      </div>
      <wizard-slider :slides="slides" />
    </div>
    <div class="wizard__content">
      <div class="wizard__top">
        <router-link to="/" class="wizard__goback">Back Home</router-link>
        <span>Already a member? <router-link to="/login">Log in</router-link></span>
      </div>
      <div class="wizard__bottom">
        <h1 class="wizard__title">Lets Get Started</h1>
        <p class="wizard__info">
          Enter a few details to start your 14 day free trial of FlyLine. You won’t be charged until the completion of your trial and if your travel plans change feel free to cancel at any time
        </p>

        <div class="wizard__form">
          <!--  Personal Information -->
          <div class="row">
            <div class="col-12 col-lg-6">
              <input type="text" class="wizard__input" placeholder="First Name" />
            </div>
            <div class="col-12 col-lg-6">
              <input type="text" class="wizard__input" placeholder="Last Name" />
            </div>
            <div class="col-12 col-lg-6">
              <input type="email" class="wizard__input" placeholder="Email Address" />
            </div>
            <div class="col-12 col-lg-6">
              <input type="text" class="wizard__input" placeholder="Password" />
            </div>
            <div class="col-12 col-lg-6">
              <input type="text" class="wizard__input" placeholder="Home Airport" />
            </div>
            <div class="col-12 col-lg-6">
              <input type="text" class="wizard__input" placeholder="Select a Plan" />
            </div>
          </div>
          <!--  Payment Information -->
          <div class="wizard-payment">
           <div class="wizard-payment__heading">
             <h5 class="wizard-payment__title">Payment Information</h5>
             <p class="wizard-payment__text">We will send you an email reminder 3 days before your trial ends</p>
           </div>
            <div class="row">
              <div class="col-12 col-lg-6">
                <input type="text" class="wizard__input" placeholder="Promo Code" />
              </div>
              <div class="col-12 col-lg-6">
                <input type="text" class="wizard__input" placeholder="Billing Zip" />
              </div>
              <div class="col-12 col-lg-6">
                <input type="email" class="wizard__input" placeholder="Credut Card Number" />
              </div>
              <div class="col-12 col-lg-6">
                <div class="row">
                  <div class="col-12 col-lg-6">
                    <input type="text" class="wizard__input" placeholder="Exp Date" />
                  </div>
                  <div class="col-12 col-lg-6">
                    <input type="text" class="wizard__input" placeholder="CCV" />
                  </div>
                </div>
              </div>
              <!-- Checkbox -->
              <div class="col-12">
                <label class="control control--checkbox">
                  <span>By creating a FlyLine account you agree with our <router-link to="/">Terms of Use </router-link> and <router-link to="/">Privacy Policy</router-link></span>
                  <input type="checkbox" />
                  <div class="control__indicator" />
                </label>
              </div>
              <!-- Submit Button -->
              <div class="col-12">
                <button class="wizard__submit">Start 14 Day Free Trial</button>
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
  name: "WizardGetStarted",
  components: {
    WizardSlider
  },
  data: function() {
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
};
</script>

<style lang="scss">
@import "src/assets/styles/mixins/mq";
@import "src/assets/styles/components/wizard-get-started";
</style>
