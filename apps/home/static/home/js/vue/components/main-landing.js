export const MainLanding = Vue.component("main-landing", {
  template: "#vue-main-landing-template",
  delimiters: ["[[", "]]"],
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
});
