import api from "../http.js";
import {formatDateFull, airlineIcon, userRoles} from "../../utils.js";
import {airlineCodes} from "../../airlineCodes.js";

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
      userRoles,
      frequentflyerReady: false,
      userReady: false,
      frequentflyer: {},
      user: {},
      dobText: "",
      accountSavedDisplay: false,
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
    },
  },
  delimiters: ["[[", "]]"],
  created() {
    api.get("/users/me/frequentflyer/").then(response => {
      this.frequentflyer = response.data;
      this.frequentflyerReady = true;
    });
    api.get("/users/me/").then(response => {
      this.user = response.data;
      this.userReady = true;
      this.dobText = formatDateFull(moment(this.user.dob))
    });
  },
  methods: {
    planStatus(plan) {
      if (!(this.user && this.user.subscription && this.user.subscription.plan)) {
        return null;
      }
      const planOrder = ['basic', 'basic-plus', 'pro'];
      const currentPlanIndex = planOrder.indexOf(this.user.subscription.plan);
      const planIndex = planOrder.indexOf(plan);
      if (planIndex < currentPlanIndex) return 'downgrade';
      if (planIndex === currentPlanIndex) return 'current';
      if (planIndex > currentPlanIndex) return 'upgrade';
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
        this.user = {...this.user, ...response.data};
        this.dobText = this.user.dob
            ? moment(this.user.dob).format('MM/DD/YYYY')
            : "";
        this.accountSavedDisplay = true;
        setTimeout(()=>{this.accountSavedDisplay = false}, 5000);
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
});
