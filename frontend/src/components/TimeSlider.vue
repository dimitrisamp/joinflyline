<template>
  <vue-slider :value="value" @change="change" :min="0" :max="1440" :lazy="true" tooltip="none" />
</template>

<script>
import { formatMin } from "../utils/utils.js";
import VueSlider from "vue-slider-component";

export default {
  delimiters: ["{{", "}}"],
  components: {
    VueSlider
  },
  props: ["value"],
  methods: {
    formatMin,
    change(v) {
      this.$emit("change", v);
    }
  }
};
</script>
