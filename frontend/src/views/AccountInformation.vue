<template>
  <div class="account-information">
    <div class="section-heading">
      <div class="section-heading__inner">
        <h1 class="section-heading__title">Account Information</h1>
        <p class="section-heading__text">
          Add your traveler information to speed up the booking process, <br />
          and enter your Deal Alert Prefrances so we can notify you of our best
          deals that fit your paratmers.
        </p>
      </div>
    </div>

    <div class="main-padding">
      <div class="account__form">
        <div class="row">
          <div class="col-12 col-xl-3">
            <h3>Traveler Information</h3>
          </div>
          <div v-if="userReady" class="col-12 col-xl-7">
            <form action="">
              <div class="row">
                <div class="col-12 col-lg-6">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="First Name"
                    v-model="user.first_name"
                  />
                </div>
                <div class="col-12 col-lg-6">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Last Name"
                    v-model="user.last_name"
                  />
                </div>
                <div class="col-12 col-lg-6">
                  <input
                    type="text"
                    class="form-control"
                    ref="dob"
                    placeholder="Date of Birth"
                    v-model="dobText"
                  />
                </div>
                <div class="col-12 col-lg-6">
                  <div class="account__select">
                    <select
                      class="form-control account__select-input"
                      v-model="user.gender"
                    >
                      <option value="0">Male</option>
                      <option value="1">Female</option>
                    </select>
                    <div class="account__arrow">
                      <img
                        src="@/assets/images/icons/down-arrow.png"
                        alt="Pull down"
                        width="17"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-12 col-lg-6">
                  <location-input
                    :prompt="''"
                    @place-selected="updateHomeAirport"
                    :initial-value="user.market"
                  />
                </div>
                <div class="col-12 col-lg-6">
                  <input
                    type="phone"
                    class="form-control"
                    placeholder="Phone Number"
                    v-model="user.phone_number"
                  />
                </div>
                <div class="col-12 col-lg-6">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Passport Number"
                    v-model="user.passport_number"
                  />
                </div>
                <div class="col-12 col-lg-6">
                  <input
                    type="text"
                    class="form-control mb-4"
                    placeholder="Known Traveler Number"
                    v-model="user.tsa_precheck_number"
                  />
                </div>
                <div class="col-12 col-lg-12 ml-auto text-right mb-4">
                  <span
                    v-if="accountSavedDisplay"
                    class="label-information-saved"
                    >Information saved</span
                  >
                  <button
                    type="button"
                    class="btn btn-primary"
                    @click="saveAccount"
                  >
                    Save Traveler Information
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <hr />

    <div class="main-padding">
      <div class="account__form">
        <div class="row">
          <div class="col-12 col-xl-3">
            <h3>Frequent Flyer Infomation</h3>
          </div>
          <div class="col-12 col-xl-7">
            <form action="">
              <div class="row" v-if="frequentflyerReady">
                <div
                  v-for="(label, value) in frequentFlyerNames"
                  class="col-12 col-lg-6"
                  :key="`frequent-flyer-${label}`"
                >
                  <div class="form-group">
                    <input
                      type="text"
                      class="form-control"
                      :placeholder="airlineCodes[label]"
                      v-model="frequentflyer[value]"
                    />
                    <img
                      class="account__form-icon"
                      :src="airlineIcon(label)"
                      alt=""
                    />
                  </div>
                </div>
                <div class="w-100"></div>
                <div class="col-12 col-lg-6 ml-auto text-right mb-4">
                  <button
                    type="button"
                    class="btn btn-primary"
                    @click.prevent="saveFrequentFlyer"
                  >
                    Save Frequent Flyer Information
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <hr />
    <account-deals />

    <hr />

    <account-companion v-if="user.role === userRoles.subscriber" />

    <hr />

    <div class="main-padding" v-if="plans">
      <div class="account__form">
        <div class="row">
          <div class="col-12 col-xl-3">
            <h3>Subscription Management</h3>
          </div>
          <div class="col-12 col-xl-7">
            <div class="row justify-content-center">
              <div
                class="col-12 col-lg-6"
                v-for="(plan, code) in plans"
                :key="`plan-${code}`"
              >
                <div class="subscription">
                  <div class="subscription__top">
                    <div class="subscription__title">
                      <h4
                        class="subscription__heading subscription__heading--type"
                      >
                        {{ plan.name }}
                      </h4>
                      <h3
                        v-if="plan.price"
                        class="subscription__heading subscription__heading--price"
                      >
                        ${{ plan.price.value }}/yr
                      </h3>
                      <h3
                        v-else
                        class="subscription__heading subscription__heading--price"
                      >
                        Free
                      </h3>
                    </div>
                    <ul class="subscription__list">
                      <li class="subscription__item">
                        - Flight Search and Book
                      </li>
                      <li class="subscription__item">- Auto Check-in</li>
                      <li v-if="plan.limit" class="subscription__item">
                        - Max of {{ plan.limit }} Bookings
                      </li>
                      <li v-else class="subscription__item">
                        - Unlimited Bookings
                      </li>
                      <li class="subscription__item">
                        - Access to FlyLine Portal
                      </li>
                      <li v-if="plan.deal_alerts" class="subscription__item">
                        - Deal alerts
                      </li>
                      <li v-if="plan.companion" class="subscription__item">
                        <!-- - {{ plans[pk].companion }} companion account{{ plans[pk].companion>1?"s":"" }} -->
                        - Companion account
                      </li>
                    </ul>
                  </div>
                  <div class="subscription__bottom">
                    <button
                      v-if="planStatus(code) === 'current'"
                      class="button button--outline-blue"
                      @click="cancelPlan"
                    >
                      Cancel Plan
                    </button>
                    <button
                      v-else-if="planStatus(code) === 'upgrade'"
                      class="button button--outline-blue"
                    >
                      Upgrade plan
                    </button>
                    <button v-else class="button button--outline-blue">
                      Downgrade plan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import Lightpick from "lightpick";
import api from "../utils/http";
import { formatDateFull, airlineIcon, userRoles } from "../utils/utils";
import { airlineCodes } from "../utils/airlineCodes";
import Vuex from "vuex";
import LocationInput from "../components/LocationInput";
import AccountCompanion from "../components/AccountCompanion";
import AccountDeals from "../components/AccountDeals";

const frequentFlyerNames = {
  american_airlines: "AA",
  united_airlines: "UA",
  southwest_airlines: "WN",
  sun_country_airlines: "SY",
  frontier_airlines: "F9",
  delta_airlines: "DL",
  alaska_airlines: "AS",
  jetBlue: "B6",
  spirit_airlines: "NK",
  allegiant_air: "G4",
  hawaiian_airlines: "HA"
};

export default {
  components: {
    AccountDeals,
    AccountCompanion,
    LocationInput
  },
  data() {
    return {
      userRoles,
      frequentflyerReady: false,
      userReady: false,
      frequentflyer: {},
      user: {},
      dobText: "",
      accountSavedDisplay: false
    };
  },
  watch: {
    userReady(val) {
      if (!val) return;
      this.$nextTick(() => {
        const that = this;
        new Lightpick({
          field: this.$refs.dob,
          onSelect(value) {
            that.setDOB(value);
          }
        });
      });
    }
  },
  delimiters: ["{{", "}}"],
  created() {
    api.get("/users/me/frequentflyer/").then(response => {
      this.frequentflyer = response.data;
      this.frequentflyerReady = true;
    });
    api.get("/users/me/").then(response => {
      this.user = response.data;
      this.userReady = true;
      this.dobText = formatDateFull(moment(this.user.dob));
    });
  },
  methods: {
    planStatus(plan) {
      if (
        !(this.user && this.user.subscription && this.user.subscription.plan)
      ) {
        return null;
      }
      const planOrder = ["basic", "pro"];
      const currentPlanIndex = planOrder.indexOf(this.user.subscription.plan);
      const planIndex = planOrder.indexOf(plan);
      if (planIndex < currentPlanIndex) return "downgrade";
      if (planIndex === currentPlanIndex) return "current";
      if (planIndex > currentPlanIndex) return "upgrade";
    },
    updateHomeAirport(value) {
      this.user.market = value;
    },
    setDOB(value) {
      this.user.dob = value.format().slice(0, 10);
    },
    saveFrequentFlyer() {
      api
        .patch("/users/me/frequentflyer/", this.frequentflyer)
        .then(response => {
          this.frequentflyer = response.data;
        });
    },
    saveAccount() {
      api.patch("/users/me/", this.user).then(response => {
        this.user = { ...this.user, ...response.data };
        this.dobText = this.user.dob
          ? moment(this.user.dob).format("MM/DD/YYYY")
          : "";
        this.accountSavedDisplay = true;
        setTimeout(() => {
          this.accountSavedDisplay = false;
        }, 5000);
      });
    },
    cancelPlan() {
      api.post("subscriptions/cancel-subscription");
    },
    airlineIcon
  },
  computed: {
    ...Vuex.mapState("plans", ["plans"]),
    frequentFlyerNames() {
      return frequentFlyerNames;
    },
    airlineCodes() {
      return airlineCodes;
    }
  }
};
</script>
