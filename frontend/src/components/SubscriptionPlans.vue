<template>
  <div
    v-if="plans"
    class="section fp-auto-height-responsive fp-section"
    id="subscription"
  >
    <div class="section5-Bg">
      <div class="text-center section5-content">
        <h3>Your Easiest Travel Decision</h3>
        <p style="margin-top: 16px;">
          Tap into More Savings, More Benefits, and More <br />
          Travel with a FlyLine membership
        </p>
      </div>

      <div v-if="$mq !== 'sm'" class="container">
        <!-- Tab panes -->
        <div class="d-flex justify-content-center pricing-section-home">
          <div
            v-for="(plan, code) in plans"
            :key="code"
            class="h-planbox text-center pricing-border"
          >
            <strong>{{ plan.name }}</strong>
            <h3 v-if="plan.price" class="h-planbox__header">
              ${{ plan.price.value }}/<span>yr</span>
            </h3>
            <h3 v-else class="h-planbox__header">Free</h3>
            <ul class="plan-list" style="margin-bottom: 30px;">
              <li>
                - Flights Search & Booking
              </li>
              <li>
                - Auto Check-in
              </li>
              <li v-if="plan.limit === null">
                - Unlimited bookings
              </li>
              <li v-else>- Max of {{ plan.limit }} bookings</li>
              <li v-if="plan.deal_alerts">
                - Deal alerts
              </li>
              <li v-if="plan.companion">
                <!-- - {{ plans[pk].companion }} companion account{{ plans[pk].companion>1?"s":"" }} -->
                - Companion account
              </li>
            </ul>
            <router-link
              :to="{ name: 'get-started', params: { plan: code } }"
              class="btn btn-default"
              >Get Started
            </router-link>
          </div>
        </div>
        <!-- plane 1 -->
        <!-- tab content -->
      </div>

      <!-- Mobile View Price Plan -->
      <div class="mobile-pricing-plan" v-else>
        <!-- Tab panes -->
        <div class="pricing-section-home">
          <div class="spacing-price" v-for="(plan, code) in plans" :key="code">
            <div class="h-planbox text-center pricing-border">
              <strong>{{ plan.name }}</strong>
              <h3 v-if="plan.price" class="h-planbox__header">
                ${{ plan.price.value }}/<span>yr</span>
              </h3>
              <h3 v-else class="h-planbox__header">
                Free
              </h3>
              <ul class="plan-list" style="margin-bottom: 30px;">
                <li>
                  - Flights Search & Booking
                </li>
                <li>
                  - Auto Check-in
                </li>
                <li v-if="plan.limit !== null">
                  - Max of {{ plan.limit }} bookings
                </li>
                <li v-else>
                  - Unlimited bookings
                </li>
                <li v-if="plan.deal_alerts">
                  - Deal alerts
                </li>
                <li v-if="plan.companion">
                  - Companion account
                </li>
              </ul>
              <router-link
                :to="{ name: 'get-started', params: { plan: code } }"
                class="btn btn-default"
                >Get Started
              </router-link>
            </div>
          </div>
        </div>
        <!-- tab content -->
      </div>
    </div>
  </div>
</template>

<script>
import Vuex from "vuex";

export default {
  delimiters: ["{{", "}}"],
  computed: {
    ...Vuex.mapState("plans", ["plans"])
  }
};
</script>
