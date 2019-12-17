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
        <div class="text-center pricing-tabs">
          <!-- Nav tabs -->
          <ul class="nav nav-tabs" role="tablist">
            <li
              v-for="(o, paneIndex) in planTabs"
              :key="`plan-tab-${paneIndex}`"
              class="nav-item"
            >
              <a
                class="nav-link"
                :class="{ active: paneIndex === selectedIndex }"
                @click="setSelectedIndex(paneIndex)"
                >{{ o.label }}</a
              >
            </li>
          </ul>
        </div>
        <!-- Tab panes -->
        <div class="tab-content">
          <div
            v-for="(o, paneIndex) in planTabs"
            :key="`plan-tab-${paneIndex}`"
            class="container tab-pane"
            :class="{
              active: paneIndex === selectedIndex,
              fade: paneIndex !== selectedIndex
            }"
          >
            <div class="d-flex justify-content-center pricing-section-home">
              <div
                v-for="pk in o.plans"
                :key="pk"
                class="h-planbox text-center pricing-border"
              >
                <strong>{{ plans[pk].name }}</strong>
                <h3 class="h-planbox__header">
                  ${{ plans[pk].price.value }}/<span>yr</span>
                </h3>
                <ul class="plan-list" style="margin-bottom: 30px;">
                  <li>
                    - Flights Search & Booking
                  </li>
                  <li>
                    - Auto Check-in
                  </li>
                  <li v-if="plans[pk].limit === null">
                    - Unlimited bookings
                  </li>
                  <li v-else>- Max of {{ plans[pk].limit }} bookings</li>
                  <li v-if="plans[pk].deal_alerts">
                    - Deal alerts
                  </li>
                  <li v-if="plans[pk].companion">
                    <!-- - {{ plans[pk].companion }} companion account{{ plans[pk].companion>1?"s":"" }} -->
                    - Companion account
                  </li>
                </ul>
                <router-link
                  :to="{ name: 'get-started', params: { plan: pk } }"
                  class="btn btn-default"
                  >Get Started
                </router-link>
              </div>
            </div>
          </div>
          <!-- plane 1 -->
        </div>
        <!-- tab content -->
      </div>

      <!-- Mobile View Price Plan -->
      <div class="mobile-pricing-plan" v-else>
        <div class="text-center pricing-tabs">
          <!-- Nav tabs -->
          <ul class="nav nav-tabs" role="tablist">
            <li
              v-for="(o, paneIndex) in planTabs"
              :key="`plan-tab-${paneIndex}`"
              class="nav-item"
            >
              <a
                class="nav-link"
                :class="{ active: paneIndex === selectedIndex }"
                data-toggle="tab"
                @click="setSelectedIndex(paneIndex)"
                >{{ o.label_mobile }}</a
              >
            </li>
          </ul>
        </div>
        <!-- Tab panes -->
        <div class="tab-content">
          <div
            v-for="(o, paneIndex) in planTabs"
            :key="`plan-tab-${paneIndex}`"
            class="tab-pane"
            :class="{
              active: paneIndex === selectedIndex,
              fade: paneIndex !== selectedIndex
            }"
          >
            <div class="pricing-section-home">
              <div class="spacing-price" v-for="pk in o.plans" :key="pk">
                <div class="h-planbox text-center pricing-border">
                  <strong>{{ plans[pk].name }}</strong>
                  <h3 class="h-planbox__header">
                    ${{ plans[pk].price.value }}/<span>yr</span>
                  </h3>
                  <ul class="plan-list" style="margin-bottom: 30px;">
                    <li>
                      - Flights Search & Booking
                    </li>
                    <li>
                      - Auto Check-in
                    </li>
                    <li v-if="plans[pk].limit !== null">
                      - Max of {{ plans[pk].limit }} bookings
                    </li>
                    <li v-else>
                      - Unlimited bookings
                    </li>
                    <li v-if="plans[pk].deal_alerts">
                      - Deal alerts
                    </li>
                    <li v-if="plans[pk].companion">
                      <!-- - {{ plans[pk].companion }} companion account{{ plans[pk].companion>1?"s":"" }} -->
                      - Companion account
                    </li>
                  </ul>
                  <router-link
                    :to="{ name: 'get-started', params: { plan: pk } }"
                    class="btn btn-default"
                    >Get Started
                  </router-link>
                </div>
              </div>
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
  data() {
    return {
      planTabs: [
        {
          group: "basic",
          label: "FlyLine Basic",
          label_mobile: "Basic",
          plans: ["basic", "basic-plus"]
        },
        {
          group: "pro",
          label: "FlyLine Pro",
          label_mobile: "Pro",
          plans: ["pro"]
        }
      ],
      selectedIndex: 0
    };
  },
  methods: {
    setSelectedIndex(i) {
      this.selectedIndex = i;
    }
  },
  computed: {
    ...Vuex.mapState("plans", ["plans"])
  }
};
</script>
