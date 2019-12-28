<template>
  <section class="membership-explained">
    <!-- Header Start -->
    <header>
      <nav-bar />
    </header>
    <!-- Header Ends-->
    <!-- Tabs Start -->
    <div class="tabs__container membership-explained__tab--dark">
      <div class="container">
        <h2 class="tabs__heading">What’s the right plan for you?</h2>
        <p class="tabs__subtitle">
          Whether you travel for leisure or for work, we have a plan for you.
          Use our helpful <br />
          guide to assist with selecting the right plan for your travel type.
        </p>
        <div class="row">
          <div class="col-12 col-lg-9 m-auto">
            <tabs v-if="plans">
              <tab
                v-for="(tab, paneIndex) in tabs"
                :title="tab.title"
                :key="`tab-${tab.plan}`"
                :selected="selectedIndex === paneIndex"
              >
                <div class="row">
                  <div class="col-12 col-lg-5">
                    <div class="subscription">
                      <div class="subscription__top">
                        <div class="subscription__title">
                          <h4
                            class="subscription__heading subscription__heading--type"
                          >
                            {{ plans[tab.plan].name }}
                          </h4>
                          <h3
                            class="subscription__heading subscription__heading--price"
                          >
                            ${{ plans[tab.plan].price.value }}/yr
                          </h3>
                        </div>
                        <ul class="subscription__list">
                          <li class="subscription__item">
                            - Flight Search and Book
                          </li>
                          <li class="subscription__item">
                            - Automatic check in
                          </li>
                          <li
                            v-if="plans[tab.plan].limit"
                            class="subscription__item"
                          >
                            - Max of {{ plans[tab.plan].limit }} Bookings
                          </li>
                          <li v-else class="subscription__item">
                            - Unlimited Bookings
                          </li>
                          <li
                            v-if="plans[tab.plan].deal_alerts"
                            class="subscription__item"
                          >
                            - Deal alerts
                          </li>
                          <li
                            v-if="plans[tab.plan].companion"
                            class="subscription__item"
                          >
                            <!-- - {{ plans[tab.plan].companion }} companion account{{ plans[tab.plan].companion>1?"s":"" }} -->
                            - Companion account
                          </li>
                        </ul>
                      </div>
                      <div class="subscription__bottom">
                        <router-link
                          :to="{
                            name: 'get-started',
                            params: { plan: tab.plan }
                          }"
                          class="button button--outline-blue"
                          >Get Started</router-link
                        >
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-lg-7">
                    <div class="tabs__content-inner">
                      <h2>This Plan is Built For</h2>
                      <ul>
                        <li v-for="item in tab.builtFor" :key="item">
                          {{ item }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </tab>
            </tabs>
          </div>
        </div>
      </div>
    </div>
    <!-- Tabs Ends -->
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
    <!-- Business Model Start -->
    <div class="business-model">
      <div class="container">
        <div class="business-model__container">
          <h2 class="business-model__title">Ready to Save?</h2>
          <p class="business-model__text">
            Are you ready to start saving on flights and simplify your travel?
            <br />
            Click the button below to get started with your FlyLine membership.
            Plans start at $39.
          </p>
          <router-link :to="{ name: 'get-started' }" class="button button--big"
            >Get Started</router-link
          >
        </div>
      </div>
    </div>
    <!-- Business Model Ends -->
    <footer>
      <main-landing-footer />
    </footer>
  </section>
</template>

<script>
import Vuex from "vuex";
import MainLandingFooter from "../components/MainLandingFooter";
import NavBar from "../components/NavBar";
import Tabs from "../components/Tabs";
import Tab from "../components/Tab";

export default {
  components: {
    Tab,
    Tabs,
    NavBar,
    MainLandingFooter
  },
  delimiters: ["{{", "}}"],
  data() {
    return {
      tabs: [
        {
          title: "0 - 6 Bookings",
          plan: "basic",
          builtFor: ["Leisure Travelers", "Solo Travelers", "Small Family Trip"]
        },
        {
          title: "9+ Bookings",
          plan: "pro",
          builtFor: ["Business Travel", "Active Leisure Travelers"]
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
