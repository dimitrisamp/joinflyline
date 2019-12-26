<template>
  <div class="s-result-dropdown">
    <span @click="open" v-text="text" class="arrow" />
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
import PopupSelect from "./PopupSelect.vue";
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
<style lang="scss">
.arrow {
  position: relative;
  background-color: transparent !important;
  border: 0 !important;
  padding-right: 1.5rem !important;
  &:after {
    content: "";
    background-image: url(../assets/img/dashboard/arrow-down.png);
    position: absolute;
    right: 0;
    z-index: 11;
    top: calc(50% + 1px);
    transform: translateY(-50%);
    background-size: 1.0625rem 0.625rem;
    width: 1.0625rem;
    height: 0.625rem;
    background-repeat: no-repeat;
    transition: transform 300ms ease-in-out;
    opacity: 0.6;
  }
}
</style>
