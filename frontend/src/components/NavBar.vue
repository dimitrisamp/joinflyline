<template>
  <nav class="navbar navbar-expand-lg navbar-dark nav-navbar-trip default-nav">
    <div class="container">
      <router-link
        class="navbar-brand nav-logo flex-grow-1"
        :to="{ name: 'index' }"
      >
        <img src="@/assets/img/logo-white.svg" />
      </router-link>
      <button
        class="navbar-toggler nav-home"
        type="button"
        @click="toggleNavigation"
      >
        <span class="navbar-toggler-icon" />
      </button>
      <div :class="{ collapse: !showNavigation && $mq === 'sm' }">
        <div class="navbar-nav ml-auto">
          <div class="nav-item">
            <router-link :to="{ name: 'index' }" class="btn">
              Deals
            </router-link>
            <router-link
              :to="{ name: 'index' }"
              class="btn my-2 get-s-btn my-sm-0"
            >
              Book
            </router-link>
            <router-link
              :to="{ name: 'sign-in' }"
              :class="{ 'btn-online': !isMobile }"
              class="btn my-2 get-s-btn my-sm-0"
              >Log In</router-link
            >
            <router-link
              :to="{ name: 'get-started' }"
              :class="{
                'btn-outline': !isMobile,
                'btn-outline--blue': !isMobile
              }"
              class="btn my-2 get-s-btn my-sm-0"
              >Join</router-link
            >
          </div>
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
