<template>
  <div class="destination">
    <div
      v-for="(dtype, dtypeId) in destinationTypes"
      class="control control--checkbox"
      :key="dtypeId"
      @click="select(dtypeId)"
    >
      <span>{{ dtype }}</span>
      <div
        class="control__indicator"
        :class="{ checked: value === dtypeId }"
      ></div>
    </div>
    <div class="control control--nomad">
      <span class="coming-soon">Coming Soon</span>
      <span>Nomad</span>
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
