<template>
  <vue-slider :value="value" @change="change" :min="0" :max="1440" :lazy="true">
    <template v-slot:tooltip="{ value }">
      <div class="custom-tooltip">{{ formatMin(value) }}</div>
    </template>
  </vue-slider>
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
