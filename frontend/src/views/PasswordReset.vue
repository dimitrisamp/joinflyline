<template>
  <div class="get-started full-bg-image">
    <div class="back-to-home">
      <router-link v-if="step === 1" :to="{ name: 'index' }"
        >Back to Home</router-link
      >
    </div>
    <section v-if="step === 1" class="step-2">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-5 col-sm-12 col-12 sm-12">
            <div class="step-formbg onborad1-form">
              <div id="navbar-progress">
                <div
                  id="navbar-progress-indicator"
                  :class="{ busy: requestSent }"
                ></div>
              </div>
              <div class="center-logo text-center">
                <img src="@/assets/img/flyline_logos-01-1.png" />
              </div>
              <div class="form-group  step-f-inputs">
                <input
                  type="text"
                  class="form-control"
                  name="email"
                  placeholder="Email Address"
                  v-model="form.email"
                />
                <small v-if="emailInvalid" class="form-text text-danger"
                  >Email is invalid</small
                >
                <small v-if="userNotFound" class="form-text text-danger"
                  >User not found</small
                >
              </div>
              <div class="form-group step-f-inputs">
                <button
                  type="button"
                  class="btn btn-default"
                  @click="submit()"
                  :disabled="!isStep1Complete"
                >
                  Reset my password
                </button>
              </div>
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
              <div class="form-logo text-center">
                <img src="@/assets/img/flyline_logos-01-1.png" />
              </div>
              <div></div>
              <div class="form-group step-f-inputs">
                <router-link :to="{ name: 'index' }" class="btn btn-default">
                  Return to Home
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import api from "../utils/http";

export default {
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
      userNotFound: false
    };
  },
  delimiters: ["{{", "}}"],
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
