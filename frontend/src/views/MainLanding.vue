<template>
  <apps-stub v-if="$mq === 'sm'"></apps-stub>
  <div v-else class="main-landing">
    <Header />
    <main>
      <main-landing-hero />
      <main-landing-airlines-logos />
      <main-landing-deals-alerts />
    </main>
    <footer>
      <main-landing-footer />
    </footer>
  </div>
</template>

<script>
import MainLandingFooter from "../components/MainLandingFooter";
import MainLandingDealsAlerts from "../components/MainLandingDealsAlerts";
import MainLandingHero from "../components/MainLandingHero";
import MainLandingAirlinesLogos from "../components/MainLandingAirlinesLogos";
import Header from "../components/Header";
import AppsStub from "./AppsStub";

export default {
  components: {
    AppsStub,
    Header,
    MainLandingHero,
    MainLandingAirlinesLogos,
    MainLandingDealsAlerts,
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
