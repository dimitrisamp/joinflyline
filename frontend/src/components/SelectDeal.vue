<template>
  <div class="destination">
    <div
      v-for="(dtype, dtypeId) in dealsTypes"
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
  </div>
</template>

<script>
import PopupSelect from "./PopupSelect.vue";
import ClickOutside from "vue-click-outside";
import { dealsTypes } from "../utils/utils";

export default {
  extends: PopupSelect,
  props: ["value"],
  data() {
    return {
      dealsTypes
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
  delimiters: ["{{", "}}"]
};
</script>
