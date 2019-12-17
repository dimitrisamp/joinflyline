<template>
  <nav
    class="navbar navbar-expand-lg navbar-light  nav-navbar-trip default-nav justify-content-between"
  >
    <div class="container">
      <router-link
        class="navbar-brand nav-logo flex-grow-1"
        :to="{ name: 'index' }"
      >
        <img src="@/assets/img/flyline_logos-01-1.png" />
      </router-link>
      <button
        class="navbar-toggler nav-home"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon" />
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <div class="navbar-nav ml-auto">
          <div class="nav-item">
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
  methods: {
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
