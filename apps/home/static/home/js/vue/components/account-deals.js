import api from "../http.js";
import {airlineCodes} from "../../airlineCodes.js";
import {formatPlace} from "../../utils.js";

function emptyForm() {
  return {
    destination: null,
    max_price: null,
    airlines: [],
  }
}

export const AccountDeals = Vue.component("account-deals", {
  template: "#vue-account-deals-template",
  delimiters: ["[[", "]]"],
  data() {
    let options = Object.entries(airlineCodes).map(o => {
      let [code, label] = o;
      return {code, label};
    }).sort((a, b) => {
      if (a.label > b.label) return 1;
      if (a.label === b.label) return 0;
      return -1;
    });
    return {
      dealWatches: [],
      form: emptyForm(),
      airlineCodes: options,
    };
  },
  methods: {
    formatPlace,
    formatAirlines(airlines) {
      return airlines.map(o=>airlineCodes[o]).join(', ');
    },
    loadDealWatches() {
      api.get("/deal-watch/").then((response) => {
        this.dealWatches = response.data
      });
    },
    addDealWatch() {
      let params = {...this.form, airlines: this.form.airlines.map(o=>o.code)};
      api.post("/deal-watch/", params).then((response) => {
        this.dealWatches.push(response.data);
        this.form = emptyForm();
      });
    },
    deleteDealWatch(dw) {
      api.delete(`/deal-watch/${dw.id}/`).then((response) => {
        this.dealWatches = this.dealWatches.filter(o=>o.id !== dw.id);
      });
    },
    updateDestination(data) {
      this.form.destination = data;
    }
  },
  mounted() {
    this.loadDealWatches();
  }
});
