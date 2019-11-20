import {SearchForm} from "./search-form.js";
import {FilterForm} from "./filter-form.js";


export const Home = {
  template: "#vue-home-template",
  name: "search-form",
  mixins: [SearchForm, FilterForm],
  delimiters: ["{(", ")}"],
  watch: {
     $mq(val, oldVal) {
      if (val === oldVal) return;
      this.$nextTick(() => {
        if (val === "sm") {
          this.destroyFullPage();
        } else {
          this.applyFullPage();
        }
      });
    }
  },
  methods: {
    calcHeightOfHeader() {
      const headerEl = document.querySelector('.header').offsetHeight;
      const searchContainer = document.querySelector('.search-container');
      if (headerEl) {
        searchContainer.style.paddingTop = headerEl + 'px';
      }
    },
    searchFromHome() {
      this.search();
      this.$router.push({'name': 'search-results'});
    },
    applyFullPage() {
      if (this.$mq !== 'sm') {
        if (this.fullPageApplied) return;
        this.fullPageApplied = true;
        $("#fullpage").fullpage({
          scrollBar: true,
          navigation: true,
          normalScrollElements: ".normal-scroll",
          responsiveWidth: 768
        });
      }
    },
    destroyFullPage() {
      if (this.fullPageApplied) {
        fullpage_api.destroy("all");
        this.fullPageApplied = false;
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.applyFullPage();
    });
    this.calcHeightOfHeader();
    window.addEventListener('resize', this.calcHeightOfHeader);
  },
  beforeDestroy() {
    this.destroyFullPage();
  },
};
