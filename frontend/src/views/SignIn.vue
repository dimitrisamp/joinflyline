<template>
  <div class="full-bg-image">
    <div class="back-to-home">
      <router-link :to="{ name: 'index' }">Back to Home</router-link>
    </div>

    <!-- Form -->
    <section class="white-block">
      <div class="container">
        <div class="formBg signIn-align mx-auto">
          <div v-if="authErrorText" class="alert alert-danger text-center">
            {{ authErrorText }}
          </div>
          <div class="center-logo text-center">
            <router-link :to="{ name: 'index' }">
              <img
                src="@/assets/img/flyline_logos-01-1.png"
                class="r-logo"
                alt="Logo"
            /></router-link>
          </div>
          <form v-on:submit.prevent="handleSubmit">
            <div class="form-group">
              <input
                type="text"
                v-model="email"
                class="form-control"
                name="email"
                placeholder="Email Address"
              />
            </div>

            <div class="form-group">
              <input
                type="password"
                v-model="password"
                class="form-control"
                name="password"
                placeholder="Password"
              />
            </div>

            <button type="submit" class="btn btn-default submit-btn">
              Log In
            </button>
            <router-link :to="{ name: 'password-reset' }" class="forgot-link"
              >Forgot Password?</router-link
            >
            <!-- TODO: Move forgot password here -->
          </form>
        </div>
        <div class="sign-bottom">
          <p class="already-txt">
            Don't have an account?
            <router-link :to="{ name: 'get-started' }">Sign Up</router-link>
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Vuex from "vuex";

export default {
  delimiters: ["{{", "}}"],
  metaInfo: {
    title: "Log In | FlyLine"
  },
  data() {
    return {
      email: "",
      password: "",
      hasError: false
    };
  },
  methods: {
    ...Vuex.mapActions("user", ["authenticate"]),
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
