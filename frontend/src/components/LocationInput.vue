<template>
  <div :class="{ shadowsrch: focused }">
    <div class="search-item" :class="{ 'is-wide': isWide }">
      <input
        type="text"
        autocomplete="disabled"
        class="form-control search-input"
        :placeholder="
          $mq === 'sm' ? (focused ? promptMobileFocus : promptMobile) : prompt
        "
        @focus="onFocused"
        @blur="onBlurred"
        v-model="text"
        @input="onInput"
      />

      <div
        class="dropdown-list"
        :class="{ hidden: !focused && !searchProgress }"
      >
        <ul v-if="searchResults.length > 0" class="list-Sdown">
          <li
            v-for="(place, index) of searchResults"
            :key="`place-${index}`"
            @click="choose(index)"
            :class="place.type"
            class="dropdown-item"
          >
            <div class="dropdown-label">
              {{ place.type === "airport" ? "Airport" : "City" }}
            </div>
            <div class="dropdown-text" v-text="formatPlace(place)" />
          </li>
        </ul>
        <!-- <p v-else-if="!requestProgress">Start typing city name...</p> -->
        <p v-else-if="requestProgress">Loading...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce, locationSearch, formatPlace } from "../utils/utils";

const DEFAULT_PROMPT = "Enter location";

export default {
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
    promptMobileFocus: {
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
    },
    isWide: {
      type: Boolean
    }
  },
  data() {
    return {
      focused: false,
      searchResults: [],
      requestProgress: false,
      searchProgress: false,
      selectedIndex: 0,
      text: ""
    };
  },
  watch: {
    initialValue: {
      immediate: true,
      handler() {
        this.text = formatPlace(this.initialValue);
      }
    }
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
      setTimeout(() => (this.focused = false), 150);
      this.searchProgress = false;
    },
    choose(i) {
      this.selectedIndex = i;
      this.searchProgress = false;
      this.text = formatPlace(this.place);
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
      locationSearch(this.text)
        .then(data => {
          that.searchResults = data.map(this.processLocation);
        })
        .finally(() => {
          that.requestProgress = false;
          that.searchProgress = false;
        });
    }, 500)
  },
  delimiters: ["{{", "}}"],
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
    }
  }
};
</script>
