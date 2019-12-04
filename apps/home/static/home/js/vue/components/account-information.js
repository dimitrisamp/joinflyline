import api from "../http.js";
import { formatDateFull, airlineIcon } from "../../utils.js";
import { airlineCodes } from "../../airlineCodes.js";

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

export const AccountInformation = Vue.component("account-information", {
  template: "#vue-account-information-template",
  data() {
    return {
      account_ready: false,
      profile_ready: false,
      frequentflyer_ready: false,
      user_ready: false,
      deals_ready: false,
      account: {},
      profile: {},
      frequentflyer: {},
      user: {},
      dobText: "",
      planTabs: [
        {
          group: "basic",
          label: "Basic",
          plans: ["basic", "basic-plus"]
        },
        {
          group: "pro",
          label: "Pro",
          plans: ["pro"]
        }
      ],
      selectedIndex: 0
    };
  },
  delimiters: ["[[", "]]"],
  created() {
    api.get("/users/me/account/").then(response => {
      this.account = response.data;
      this.account_ready = true;
    });
    api.get("/users/me/profile/").then(response => {
      this.profile = response.data;
      this.dobText = response.data.dob
        ? formatDateFull(new Date(response.data.dob))
        : "";
      this.profile_ready = true;
    });
    api.get("/users/me/frequentflyer/").then(response => {
      this.frequentflyer = response.data;
      this.frequentflyer_ready = true;
    });
    api.get("/users/me/").then(response => {
      this.user = response.data;
      this.user_ready = true;
    });
  },
  methods: {
    planStatus(plan) {
      if (!(this.user && this.user.subscriptions && this.user.subscriptions.plan)) {
        return null;
      }
      const planOrder = ['basic', 'basic-plus', 'pro'];
      const currentPlanIndex = planOrder.indexOf(this.user.subscriptions.plan)
      const planIndex = planOrder.indexOf(plan);
      if (planIndex < currentPlanIndex) return 'downgrade';
      if (planIndex === currentPlanIndex) return 'current';
      if (planIndex > currentPlanIndex) return 'upgrade';
    },
    updateHomeAirport(value) {
      this.profile.market = value;
    },
    setDOB(value) {
      this.profile.dob = value.format().slice(0, 10);
    },
    saveFrequentFlyer() {
      api
        .patch("/users/me/frequentflyer/", this.frequentflyer)
        .then(response => {
          this.frequentflyer = response.data;
        });
    },
    saveAccount() {
      api.patch("/users/me/profile/", this.profile).then(response => {
        this.profile = response.data;
        this.dobText = response.data.dob
          ? formatDateFull(new Date(response.data.dob))
          : "";
      });
      api.patch("/users/me/account/", this.account).then(response => {
        this.account = response.data;
      });
      api.patch("/users/me/", this.user).then(response => {
        this.user = response.data;
      });
    },
    airlineIcon
  },
  computed: {
    ...Vuex.mapState(['plans']),
    frequentFlyerNames() {
      return frequentFlyerNames;
    },
    airlineCodes() {
      return airlineCodes;
    }
  },
  mounted() {
    const that = this;
    new Lightpick({
      field: this.$refs.dob,
      onSelect(value) {
        that.setDOB(value);
      }
    });
  }
});
