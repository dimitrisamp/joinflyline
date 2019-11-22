import { debounce, locationSearch, formatPlace } from "../../utils.js";

const DEFAULT_PROMPT = "Enter location";

export const LocationInput = Vue.component("location-input", {
  props: {
    initialValue: {
      type: Object,
      required: false
    },
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
      selectedIndex: 0
    };
  },
  methods: {
    formatPlace,
    onFocused(e) {
      this.focused = true;
      this.$nextTick(() => {
        e.target.focus();
        e.target.select();
        if (this.$mq === "sm") {
          e.target.parentElement.scrollIntoView();
          e.target.setAttribute("autofocus", "autofocus");
        }
      });
    },
    onBlurred() {
      setTimeout(_ => (this.focused = false), 150);
      this.searchProgress = false;
    },
    choose(i) {
      this.selectedIndex = i;
      this.searchProgress = false;
      this.$emit("place-selected", this.place);
    },
    processLocation(loc) {
      let value = { type: loc.type, code: loc.code, name: loc.name };
      if (loc.type === "city") {
        value.subdivision = {
          name: loc.subdivision ? loc.subdivision.name : null
        };
        value.country = { code: loc.country.code };
      }
      return value;
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
          that.searchResults = data.map(this.processLocation);
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
    place() {
      if (this.searchResults.length > 0) {
        return this.searchResults[this.selectedIndex];
      } else {
        if (this.initialValue) {
          return this.initialValue;
        }
      }
      return null;
    },
    text() {
      return formatPlace(this.place);
    }
  }
});
