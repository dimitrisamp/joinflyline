<template>
  <div class="main-landing">
    <header><nav-bar /></header>
    <main>
      <main-landing-hero />
      <main-landing-steps />
      <main-landing-stats />
      <main-landing-airlines-logos />
      <main-landing-deals-alerts />
      <subscription-plans />
    </main>
    <footer>
      <main-landing-footer />
    </footer>
  </div>
</template>

<script>
import MainLandingFooter from "../components/MainLandingFooter";
import SubscriptionPlans from "../components/SubscriptionPlans";
import MainLandingDealsAlerts from "../components/MainLandingDealsAlerts";
import MainLandingStats from "../components/MainLandingStats";
import MainLandingSteps from "../components/MainLandingSteps";
import MainLandingHero from "../components/MainLandingHero";
import MainLandingAirlinesLogos from "../components/MainLandingAirlinesLogos";
import NavBar from "../components/NavBar";

export default {
  components: {
    NavBar,
    MainLandingHero,
    MainLandingSteps,
    MainLandingStats,
    MainLandingAirlinesLogos,
    MainLandingDealsAlerts,
    SubscriptionPlans,
    MainLandingFooter
  },
  delimiters: ["{{", "}}"],
  metaInfo: {
    title: "Subscription Flight Search, Deal Alerts, Direct Booking | FlyLine"
  },
  mounted() {
    this.calcHeightOfHeader();
    window.addEventListener("resize", this.calcHeightOfHeader);
  },
  methods: {
    calcHeightOfHeader() {
      const headerEl = document.querySelector(".header");
      const searchContainer = document.querySelector(".search-container");
      if (headerEl) {
        searchContainer.style.paddingTop = headerEl.offsetHeight + "px";
      }
    }
  },
  computed: {
    isMobile() {
      return this.$mq === "sm";
    }
  }
};
</script>
