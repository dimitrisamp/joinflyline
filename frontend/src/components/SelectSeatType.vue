<template>
  <div class="s-result-dropdown">
    <span @click="open" v-text="text" />
    <div
      class="search-f-dropdown"
      v-if="selectProgress"
      v-click-outside="close"
    >
      <ul class="s-dropdown-list">
        <li
          v-for="(name, type) in seatTypes"
          :key="type"
          @click="select(type)"
          v-text="name"
        />
      </ul>
    </div>
  </div>
</template>

<script>
import { PopupSelect } from "./PopupSelect.vue";
import { seatTypes } from "../utils/utils";
import ClickOutside from "v-click-outside";

export default {
  extends: PopupSelect,
  props: ["value"],
  directives: {
    ClickOutside
  },
  data() {
    return {
      seatTypes
    };
  },
  methods: {
    select(value) {
      this.$emit("select", value);
      this.close();
    }
  },
  delimiters: ["{{", "}}"],
  computed: {
    text() {
      return seatTypes[this.value];
    }
  }
};
</script>
