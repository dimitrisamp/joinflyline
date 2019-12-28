<template>
  <div class="filter-flights">
    <div class="filter-sidebar__item-text">
      ${{ limits[0] }} - ${{ limits[1] }}
    </div>
    <vue-slider
      v-model="limits"
      :enable-cross="false"
      :min="priceLimits.min || 0"
      :max="priceLimits.max || 3000"
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
  methods: {
    select(value) {
      this.$emit("select", value);
    }
  },
  computed: {
    limits: {
      get() {
        return this.$store.state.search.form.priceRange;
      },
      set(value) {
        this.$store.commit("search/setPriceRange", value);
      }
    },
    ...Vuex.mapGetters("search", ["priceLimits"])
  }
};
</script>
