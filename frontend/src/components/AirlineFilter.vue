<template>
  <div class="filter-flights">
    <div
      v-for="airlineData of data"
      class="filter-flights__item"
      :key="`airline-data-${airlineData.code}`"
      @click="select(airlineData.aIndex)"
    >
      <label class="control control--checkbox">
        <span>{{ airlineData.name }}</span>
        <div
          class="control__indicator"
          :class="{ checked: airlineData.checked }"
        ></div>
      </label>
      <div class="filter-flights__item-price">
        <!--{{ prices[airlineCode] }}-->
      </div>
    </div>
  </div>
  <!--    <div class="input-group input-group-sm search-dropdown">-->
  <!--        <div class="bg-white-close-holes">-->
  <!--            <span class="input-group-text search-form-input">Airline Filter</span>-->
  <!--            <input type="text" class="form-control search-input"-->
  <!--                   @focus="open" v-model="text"-->
  <!--                   placeholder="Ex, American Airlines, Delta">-->
  <!--        </div>-->
  <!--        <div class="search-f-dropdown airline-f-dropdown"-->
  <!--             v-if="selectProgress"-->
  <!--             v-click-outside="close">-->
  <!--            <ul class="s-dropdown-list">-->
  <!--                <li v-for="(airlineData, index) of data" @click="select(index)">-->
  <!--                    <label>-->
  <!--                        <span class="checkmark" :class="{checked: airlineData.checked}"></span>-->
  <!--                        <img :src="airlineIcon(airlineData.code)"/> {{ airlineData.name }}-->
  <!--                    </label>-->
  <!--                </li>-->
  <!--            </ul>-->
  <!--        </div>-->

  <!--    </div>-->
</template>

<script>
import PopupSelect from "./PopupSelect";
import { airlineIcon } from "../utils/utils";

export default {
  extends: PopupSelect,
  props: ["data", "prices"],
  methods: {
    airlineIcon,
    select(airlineCode) {
      this.$emit("select", airlineCode);
    }
  },
  computed: {
    text() {
      return this.data
        .filter(a => a.checked)
        .map(a => a.name)
        .join(", ");
    }
  },
  delimiters: ["{{", "}}"]
};
</script>
