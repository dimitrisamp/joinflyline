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
      this.focused = true;
      this.$nextTick(() => e.target.focus())
    },
    onBlurred() {
      const that = this;
      this.$nextTick(() => that.focused = false)
      this.searchProgress = false;
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
