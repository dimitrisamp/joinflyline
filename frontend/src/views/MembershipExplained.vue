<template>
  <section class="membership-explained">
    <!-- Header Start -->
    <Header />
    <!-- Header Ends-->
    <!-- Tabs Start -->
    <section class="membership-explained__hero">
      <div class="container">
        <div class="row">
          <div class="col">
            <h1 class="membership-explained__title">Memberships Explained</h1>
          </div>
        </div>
      </div>
    </section>
    <!-- Tabs Start -->
    <div class="tabs__container membership-explained__tab--light">
      <div class="container">
        <div class="row">
          <div class="col-12 col-lg-8">
            <h2 class="tabs__heading">
              Cheap Flights with Benefits? What’s the Catch?
            </h2>
            <p class="tabs__subtitle">
              There isn’t one. Seriously. Read on to learn about the features
              and benefits associated with each plan we offer.
            </p>
          </div>
          <div class="col-12 col-lg-4">
            <img
              src="@/assets/img/main-landing/airlines-logos.png"
              alt="Airlines Logo"
            />
          </div>
        </div>
        <tabs>
          <tab :selected="true" title="Flight Search & Booking">
            <ul class="membership-explained__tab-list">
              <li>Included in Basic and Pro</li>
              <li>
                A booking is the purchase of "a" flight for an individual.
              </li>
              <li>
                Basic Members are limited to six (6) bookings every twelve (12)
                months
              </li>
              <li>Pro Members have unlimited booking</li>
            </ul>
          </tab>
          <tab title="Automatic Check-in">
            <ul class="membership-explained__tab-list">
              <li>
                24 hrs before your flight we will check you in to your flight.
                No more alarms and reminders to complete this task anymore. Just
                book and forget about it. We’ll take care of the rest.
              </li>
              <li>Included in all plans (Basic, Basic Plus, and Pro)</li>
            </ul>
          </tab>
          <tab title="Companion Accounts">
            <ul class="membership-explained__tab-list">
              <li>Included with Pro plan</li>
              <li>
                A companion is defined as an individual designated by a paid
                member to be a non-paid member associated with their account
              </li>
              <li>
                When you designate a companion, they will receive a welcome
                email prompting them to setup an account with FlyLine under your
                membership
              </li>
              <li>
                Companions will be allowed to book as members, with each of
                their bookings counting against your total bookings
              </li>
              <li>Pro Members are allowed a companion</li>
            </ul>
          </tab>
          <tab title="Deal Alerts">
            <ul class="membership-explained__tab-list">
              <li>Included with Basic and Pro plans</li>
              <li>
                You have the ability to list destinations you want to monitor
                for discounts and price drops. FlyLine will then monitor these
                destinations and alert you when prices for those destinations
                reach a deal-worthy level.
              </li>
            </ul>
          </tab>
        </tabs>
      </div>
    </div>
    <!-- Tabs Ends -->
    <!-- Steps Start -->
    <main-landing-steps />
    <!-- Steps Ends -->
    <!-- Tabs Start -->
    <section class="membership-explained__plans">
      <div class="container">
        <h2 class="membership-explained__plans-title">
          Choose your plan and save
        </h2>
        <p class="membership-explained__plans-subtitle">
          Tap into More Savings, More Benefits, and More <br />
          Travel with a FlyLine membership
        </p>
        <div class="row">
          <div class="col-12 col-lg-9 m-auto">
            <div class="membership-explained__plans-list">
              <div
                v-for="tab in tabs"
                :key="`tab-${tab.plan}`"
                class="membership-explained__plan"
              >
                <div class="membership-explained__plan-head">
                  <div class="membership-explained__plan-trial">
                    14 Day Free Trial
                  </div>
                  <div class="membership-explained__plan-title">
                    {{ plans[tab.plan].name }}
                  </div>
                  <h3 class="membership-explained__plan-price">
                    ${{ plans[tab.plan].price.value }}/yr -
                    {{ tab.usersCount }}
                  </h3>
                </div>
                <ul class="membership-explained__plan-list">
                  <li class="membership-explained__plan-item">
                    - Flight Search and Book
                  </li>
                  <li class="membership-explained__plan-item">
                    - Automatic check in
                  </li>
                  <li
                    v-if="plans[tab.plan].limit"
                    class="membership-explained__plan-item"
                  >
                    - Max of {{ plans[tab.plan].limit }} Bookings
                  </li>
                  <li v-else class="membership-explained__plan-item">
                    - Unlimited Bookings
                  </li>
                  <li
                    v-if="plans[tab.plan].deal_alerts"
                    class="membership-explained__plan-item"
                  >
                    - Deal alerts
                  </li>
                  <li
                    v-if="plans[tab.plan].companion"
                    class="membership-explained__plan-item"
                  >
                    <!-- - {{ plans[tab.plan].companion }} companion account{{ plans[tab.plan].companion>1?"s":"" }} -->
                    - Companion account
                  </li>
                </ul>
                <div class="membership-explained__plan-bottom">
                  <router-link
                    :to="{
                      name: 'get-started',
                      params: { plan: tab.plan }
                    }"
                    class="membership-explained__plan-btn"
                  >
                    Start 14 Day Free Trial
                  </router-link>
                  <router-link
                    :to="{
                      name: 'terms-of-services'
                    }"
                    class="membership-explained__plan-link"
                  >
                    Terms and Conditions Apply
                  </router-link>
                </div>
              </div>

              <!-- <div class="col-12 col-lg-7">
                  <div class="tabs__content-inner">
                    <h2>This Plan is Built For</h2>
                    <ul>
                      <li v-for="item in tab.builtFor" :key="item">
                        {{ item }}
                      </li>
                    </ul>
                  </div>
                  <div class="tabs__content-inner">
                    <h2>Notes</h2>
                    <ul>
                      <li v-for="item in tab.notes" :key="item">
                        {{ item }}
                      </li>
                    </ul>
                  </div>
                </div> -->
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tabs Ends -->
    <footer>
      <main-landing-footer />
    </footer>
  </section>
</template>

<script>
import Vuex from "vuex";
import MainLandingFooter from "../components/MainLandingFooter";
import Header from "../components/Header";
import Tabs from "../components/Tabs";
import Tab from "../components/Tab";
import MainLandingSteps from "../components/MainLandingSteps";

export default {
  components: {
    Tab,
    Tabs,
    Header,
    MainLandingFooter,
    MainLandingSteps
  },
  delimiters: ["{{", "}}"],
  data() {
    return {
      tabs: [
        {
          title: "0 - 6 Bookings",
          plan: "basic",
          builtFor: [
            "Leisure Travelers",
            "Solo Travelers",
            "Small Family Trip"
          ],
          usersCount: "One User"
        },
        {
          title: "6+ Bookings",
          plan: "premium",
          builtFor: [
            "Business Travel",
            "Active Leisure Travelers",
            "Large and/or Frequent Family Travel"
          ],
          usersCount: "Two Users"
        }
      ],
      selectedIndex: 0
    };
  },
  computed: {
    ...Vuex.mapState("plans", ["plans"])
  }
};
</script>
