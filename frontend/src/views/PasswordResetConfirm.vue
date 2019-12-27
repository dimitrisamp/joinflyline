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
                  :class="{ busy: tokenCheckProgress }"
                ></div>
              </div>
              <div class="center-logo text-center">
                <img src="@/assets/img/flyline_logos-01-1.png" />
              </div>
              <div class="form-group  step-f-inputs">
                <input
                  type="password"
                  class="form-control"
                  name="password"
                  placeholder="Enter your new password"
                  v-model="form.password"
                  :disabled="tokenCheckProgress"
                />
                <small>
                  {{ passwordWarningText }}
                </small>
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
              <div class="form-group step-f-inputs" v-if="confirmSuccess">
                <span>
                  Your password has been successfully changed
                </span>
                <router-link :to="{ name: 'sign-in' }" class="btn btn-default">
                  Sign In
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
      confirmProgress: false,
      form: {
        password: ""
      },
      tokenValid: false,
      tokenCheckProgress: false,
      passwordWarningText: "",
      confirmSuccess: false
    };
  },
  delimiters: ["{{", "}}"],
  methods: {
    submit() {
      if (!this.isStep1Complete) return;
      if (this.confirmProgress) return;
      this.confirmProgress = true;
      api
        .post("password_reset/confirm/", {
          token: this.$route.query.secret,
          password: this.form.password
        })
        .then(() => {
          this.step = 2;
          this.confirmSuccess = true;
        })
        .catch((e) => {
          this.confirmSuccess = false;
          this.passwordWarningText = e.response.data.password.join(" ");
        })
        .finally(() => {
          this.confirmProgress = false;
        });
    }
  },
  created() {
    this.tokenCheckProgress = true;
    this.passwordWarningText = "";
    api
      .post("password_reset/validate_token/", {
        token: this.$route.query.secret,
        email: this.$route.query.email
      })
      .then(() => {
        this.tokenValid = true;
      })
      .catch(() => {
        this.tokenValid = false;
      })
      .finally(() => {
        this.tokenCheckProgress = false;
      });
  },
  computed: {
    isStep1Complete() {
      return this.form.password !== "";
    }
  }
};
</script>
