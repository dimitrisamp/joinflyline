<template>
  <div class="summary__inner">
    <div class="summary__inner__totals">
      <h3 class="summary__inner__totals__heading">
        Upgrade to FlyLine Basic or Premium
      </h3>
      <p>
        Get the most out of FlyLine and save when upgrading to FlyLine Basic or
        Pro
      </p>
      <div
        v-for="(plan, code) in plans"
        class="summary__inner__totals__item"
        :key="`upgrade-plan-${code}`"
        @click="toggleUpgrade(code)"
      >
        <label class="control control--checkbox">
          <div class="plan__container">
            <h6 class="plan__name">
              FlyLine {{ plan.name }} ${{ plan.price.value }}/yr
            </h6>
            <ul class="plan__features">
              <li>- Flight Search & Book</li>
              <li v-if="plan.limit">- Max of {{ plan.limit }} bookings</li>
              <li v-else>- Unlimited bookings</li>
              <li>- Access to FlyLine Portal</li>
              <li v-if="plan.deal_alerts">- Deal Alerts</li>
            </ul>
          </div>
          <div
            class="control__indicator"
            :class="{ checked: selectedPlan === code }"
          />
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import Vuex from "vuex";

export default {
  name: "UpgradeToPlan",
  data() {
    return {
      selectedPlan: null
    };
  },
  methods: {
    toggleUpgrade(code) {
      if (code === this.selectedPlan) {
        this.selectedPlan = null;
      } else {
        this.selectedPlan = code;
      }
      this.$emit("selected-plan", this.selectedPlan);
    }
  },
  computed: {
    ...Vuex.mapState("plans", ["plans"])
  }
};
</script>

<style scoped>
.plan__name {
  font-family: Dona-Black, sans-serif;
}
.plan__features {
  list-style-type: none;
  padding-left: 0;
}
.plan__container {
  display: flex;
  flex-direction: column;
}
</style>
