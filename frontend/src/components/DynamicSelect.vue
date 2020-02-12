<template>
  <select :value="value" @input="$emit('input', $event.target.value)">
    <option
      v-for="(name, val) in items"
      :key="`plan-${name}`"
      :value="val"
      :selected="val === value"
      v-html="name"
    />
  </select>
</template>

<script>
import Vuex from "vuex";

export default {
  props: ["value", "discount"],
  delimiters: ["{{", "}}"],
  methods: {
    getPriceValue(value) {
      if (value.price === null) return 0;
      if (this.discount) {
        return (value.price.value * (100 - this.discount.percentage)) / 100;
      }
      return value.price.value;
    }
  },
  computed: {
    ...Vuex.mapState("plans", ["plans"]),
    items() {
      let result = {};
      if (this.plans) {
        for (let [name, value] of Object.entries(this.plans)) {
          if (this.discount) {
            result[name] = `${value.name} ($${this.getPriceValue(value)}/yr)`;
          } else {
            result[name] = `${value.name} ($${this.getPriceValue(value)}/yr)`;
          }
        }
      }
      return result;
    }
  }
};
</script>
