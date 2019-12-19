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
import api from "../utils/http";

export default {
  data() {
    return {
      options: {}
    };
  },
  props: ["value", "discount"],
  delimiters: ["{{", "}}"],
  methods: {
    loadData() {
      api.get("subscriptions/plan/").then(response => {
        this.options = response.data;
        this.$emit("data-arrived", Object.keys(response.data)[0]);
      });
    },
    getPriceValue(value) {
      if (value.price === null) return 0;
      if (this.discount) {
        return (value.price.value * (100 - this.discount.percentage)) / 100;
      }
      return value.price.value;
    }
  },
  created() {
    this.loadData();
  },
  computed: {
    items() {
      let result = {};
      for (let [name, value] of Object.entries(this.options)) {
        if (this.discount) {
          result[name] = `${value.name} ($${this.getPriceValue(value)}/yr)`;
        } else {
          result[name] = `${value.name} ($${this.getPriceValue(value)}/yr)`;
        }
      }
      return result;
    }
  }
};
</script>
