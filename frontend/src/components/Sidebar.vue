<template>
  <aside class="sidebar" :class="{ 'sidebar--active': toggleSidebar }">
    <button
      class="hamburger hamburger--slider"
      :class="{ 'is-active': toggleSidebar }"
      @click.prevent="handleSidebarLinkClick"
    >
      <span class="hamburger-box">
        <span class="hamburger-inner" />
      </span>
    </button>
    <div class="sidebar__profile">
      <router-link to="/dashboard" class="sidebar__profile-img">
        <img
          src="@/assets/img/dashboard/logo.svg"
          alt="FlyLine
        Logo"
        />
      </router-link>
      <div class="sidebar__profile-info">
        <h4 class="sidebar__profile-title">{{ userNameSurname }}</h4>
        <p class="sidebar__profile-text">{{ userPlan }}</p>
      </div>
    </div>
    <nav class="sidebar__nav">
      <ul class="sidebar__list">
        <li class="sidebar__item">
          <router-link
            @click.native="handleSidebarLinkClick"
            :to="{ name: 'overview' }"
            class="sidebar__link"
            >FlyLine Dashboard</router-link
          >
        </li>
        <li class="sidebar__item">
          <router-link
            @click.native="handleSidebarLinkClick"
            :to="{ name: 'trips' }"
            class="sidebar__link"
            >Trip Activity</router-link
          >
        </li>
        <li class="sidebar__item">
          <router-link
            @click.native="handleSidebarLinkClick"
            :to="{ name: 'account' }"
            class="sidebar__link"
            >Account Information</router-link
          >
        </li>
      </ul>
    </nav>
    <span class="sidebar__logout" @click="logOut($router)">
      Log out
    </span>
  </aside>
</template>

<script>
import Vuex from "vuex";

export default {
  delimiters: ["{{", "}}"],
  name: "sidebar",
  methods: {
    ...Vuex.mapActions("user", ["logOut"]),
    handleSidebarLinkClick() {
      this.$store.dispatch("dashboard/toggleSidebar");
    }
  },
  computed: {
    userNameSurname() {
      if (this.user) {
        return `${this.user.first_name || ""} ${this.user.last_name || ""}`;
      }
      return "No user";
    },
    userPlan() {
      if (this.user && this.user.subscription && this.plans) {
        const p = this.plans[this.user.subscription.plan];
        if (p) return `${p.name} - $${p.price.value}/yr`;
        return "";
      }
      return null;
    },
    ...Vuex.mapState("user", ["user"]),
    ...Vuex.mapState("plans", ["plans"]),
    ...Vuex.mapState("dashboard", ["toggleSidebar"])
  }
};
</script>
