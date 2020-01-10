<template>
  <nav class="navbar navbar-expand-lg navbar-light nav-navbar-trip default-nav">
    <router-link
      class="navbar-brand nav-logo flex-grow-1"
      :to="{ name: 'index' }"
    >
      <img src="@/assets/img/flyline_logos-01-1.png" />
    </router-link>
    <button class="navbar-toggler" type="button" @click="toggleNavigation">
      <span class="navbar-toggler-icon" />
    </button>
    <div
      class="navbar-collapse"
      :class="{ collapse: !showNavigation && $mq === 'sm' }"
    >
      <div class="navbar-nav ml-auto">
        <div class="nav-item">
          <router-link :to="{ name: 'get-started' }" class="nav-link">
            <img
              class="nav-link__icon"
              src="@/assets/img/ticket-lines.svg"
              alt=""
            />
            Book
          </router-link>
        </div>
        <div class="nav-item">
          <router-link :to="{ name: 'sign-in' }" class="nav-link">
            <img
              class="nav-link__icon"
              src="@/assets/img/dollar-lines.svg"
              alt=""
            />
            Deals
          </router-link>
        </div>
        <div class="nav-item">
          <router-link :to="{ name: 'sign-in' }" class="nav-link has-border">
            <img
              class="nav-link__icon"
              src="@/assets/img/user-lines.svg"
              alt=""
            />
            Log In
          </router-link>
        </div>
        <div class="nav-item">
          <router-link :to="{ name: 'get-started' }" class="nav-link is-button"
            >Start Free Trial</router-link
          >
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import Vuex from "vuex";

export default {
  delimiters: ["{{", "}}"],
  data() {
    return {
      showNavigation: false
    };
  },
  methods: {
    toggleNavigation() {
      this.showNavigation = !this.showNavigation;
    },
    ...Vuex.mapState("user", ["logOut"])
  },
  computed: {
    ...Vuex.mapState("user", ["user"]),
    isMobile() {
      return this.$mq === "sm";
    }
  }
};
</script>
