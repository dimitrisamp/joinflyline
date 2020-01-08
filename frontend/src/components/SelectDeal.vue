<template>
  <div class="destination">
    <div class="control">
      <span class="nomad">Search & Book</span>
      <div class="control__indicator"></div>
    </div>
    <div class="control control--nomad">
      <span class="nomad">Deal Alerts</span>
      <div class="control__indicator"></div>
    </div>
  </div>
</template>

<script>
import PopupSelect from "./PopupSelect.vue";
import ClickOutside from "vue-click-outside";
import { destinationTypes } from "../utils/utils";

export default {
  extends: PopupSelect,
  props: ["value"],
  data() {
    return {
      destinationTypes
    };
  },
  directives: {
    ClickOutside
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
      return this.destinationTypes[this.value];
    }
  }
};
</script>
