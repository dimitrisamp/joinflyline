import { formatMin } from "../../utils.js";


export const TimeSlider = Vue.component("time-slider", {
  template: "#vue-time-slider-template",
  delimiters: ["[[", "]]"],
  components: {
    VueSlider: window["vue-slider-component"]
  },
  props: ['value'],
  methods: {
    formatMin,
    change(v) {
      this.$emit('change', v);
    }
  },
});
