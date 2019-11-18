import { debounce, locationSearch, formatPlace } from "../../utils.js";

const DEFAULT_PROMPT = "Enter location";

export const LocationInput = Vue.component("location-input", {
  props: {
    prompt: {
      type: String,
      required: false,
      default: DEFAULT_PROMPT
    },
    promptMobile: {
      type: String,
      required: false,
      default: DEFAULT_PROMPT
    },
    searchType: {
      type: String,
      required: false,
      default: "both",
      validator: val => ["city", "airport", "both"].includes(val)
    }
  },
  data() {
    return {
      focused: false,
      searchResults: [],
      requestProgress: false,
      searchProgress: false,
      selectedIndex: 0,
      text: "",
    };
  },
  methods: {
    formatPlace,
    onFocused(e) {
      const parentEl = e.target.parentElement;
      this.focused = true;
      if ( parentEl ) {
        document.body.style.overflow = 'hidden';
        this.$mq === 'sm' ? parentEl.scrollIntoView() : null ;
      }
    },
    onBlurred() {
      const that = this;
      setTimeout(() => {
        that.focused = false;
      }, 150);
      this.searchProgress = false;
      this.$mq === 'sm' ? document.body.scrollIntoView() : null;
      document.body.style.overflow = 'auto';
     
    },
    choose(i) {
      this.selectedIndex = i;
      this.searchProgress = false;
      this.text = formatPlace(this.place);
      this.$emit('place-selected', this.place);
    },
    onInput: debounce(function() {
      if (this.text === null || this.text.length < 3) {
        this.searchProgress = false;
        return;
      }
      this.requestProgress = true;
      this.searchProgress = true;
      const that = this;
      locationSearch(that.text)
        .then(data => {
          that.searchResults = data;
        })
        .finally(() => {
          that.requestProgress = false;
          that.searchProgress = false;
        });
    }, 500)
  },
  template: "#vue-airport-input-template",
  delimiters: ["[[", "]]"],
  computed: {
    place() { return this.searchResults.length>0?this.searchResults[this.selectedIndex]:null },
  }
});
