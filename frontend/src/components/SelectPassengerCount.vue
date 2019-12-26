<template>
  <div class="s-result-dropdown">
    <span href="#" @click="open" class="arrow">{{ text }}</span>

    <div
      class="passengers-dropdown"
      v-cloak
      v-if="selectProgress"
      v-click-outside="close"
    >
      <ul class="passengers-dropdown-list">
        <li class="p-category">
          <b>Adults</b>
          <input
            type="button"
            value="-"
            @click="decrement(1)"
            class="increment"
          />
          <input
            type="text"
            readonly="readonly"
            v-model="form.valAdults"
            class="value-select"
          />
          <input
            type="button"
            value="+"
            @click="increment(1)"
            class="increment"
          />
        </li>

        <li class="p-category">
          <b>Children</b>
          <input
            type="button"
            value="-"
            @click="decrement(2)"
            class="increment"
          />
          <input
            type="text"
            readonly="readonly"
            v-model="form.valChildren"
            class="value-select"
          />
          <input
            type="button"
            id="valAdultsIncrement"
            value="+"
            @click="increment(2)"
            class="increment"
          />
        </li>

        <li class="p-category">
          <b>Infants</b>
          <input
            type="button"
            value="-"
            @click="decrement(3)"
            class="increment"
          />
          <input
            type="text"
            readonly="readonly"
            v-model="form.valInfants"
            class="value-select"
          />
          <input
            type="button"
            value="+"
            @click="increment(3)"
            class="increment"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import ClickOutside from "v-click-outside";
import PopupSelect from "./PopupSelect.vue";
import Vuex from "vuex";

export default {
  extends: PopupSelect,
  delimiters: ["{{", "}}"],
  directives: {
    ClickOutside
  },
  methods: {
    increment(index) {
      this.updatePassengers({ index, by: 1 });
    },
    decrement(index) {
      this.updatePassengers({ index, by: -1 });
    },
    ...Vuex.mapMutations("search", ["updatePassengers"])
  },
  computed: {
    ...Vuex.mapState("search", ["form"]),
    passengers() {
      return this.form.valAdults + this.form.valChildren + this.form.valInfants;
    },
    text() {
      return `${this.passengers} Passenger${this.passengers > 1 ? "s" : ""}`;
    }
  }
};
</script>
