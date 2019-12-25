<template>
  <div class="filter-flights">
    <div class="filter-sidebar__item-text">
      ${{ limits[0] }} - ${{ limits[1] }}
    </div>
    <vue-slider
      @change="select"
      v-model="limits"
      :enable-cross="false"
      :min="priceLimits.min"
      :max="priceLimits.max"
      :lazy="true"
    />
  </div>
</template>

<script>
import VueSlider from "vue-slider-component";
import Vuex from "vuex";

export default {
  delimiters: ["{{", "}}"],
  components: {
    VueSlider
  },
  data() {
    const d = this.$store.getters["search/priceLimits"];
    return {
      limits: [d.min, d.max]
    };
  },
  methods: {
    select(value) {
      this.$emit("select", value);
    }
  },
  computed: {
    ...Vuex.mapGetters("search", ["priceLimits"]),
    text() {
      const [a, b] = this.data.limits;
      return `$${a}-$${b}`;
    }
  }
};
</script>
