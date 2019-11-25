import api from "../http.js";
import { formatDateFull } from "../../utils.js";

const frequentFlyerNames = {
  american_airlines: "American Airlines",
  united_airlines: "United Airlines",
  southwest_airlines: "Southwest Airlines",
  sun_country_airlines: "Sun Country Airlines",
  frontier_airlines: "Frontier Airlines",
  delta_airlines: "Delta Airlines",
  alaska_airlines: "Alaska Airlines",
  jetBlue: "JetBlue",
  spirit_airlines: "Spirit Airlines",
  allegiant_air: "Allegiant Air",
  hawaiian_airlines: "Hawaiian Airlines"
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
      dobText: ""
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
    }
  },
  computed: {
    frequentFlyerNames() {
      return frequentFlyerNames;
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
