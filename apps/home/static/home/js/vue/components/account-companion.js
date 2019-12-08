import api from "../http.js";
import {formatDateTime} from "../../utils.js";

function emptyForm() {
  return {
    email: null,
  }
}

const statusText = new Map([
    [0, 'Created'],
    [1, 'Email sent'],
    [2, 'Active']
]);

export const AccountCompanion = Vue.component('account-companion', {
  template: '#vue-account-companion-template',
  delimiters: ['[[', ']]'],
  data() {
    return {
      companions: [
      ],
      form: emptyForm(),
    };
  },
  methods: {
    getStatusText(status) {
      return statusText.get(status);
    },
    formatDateTime,
    loadCompanions() {
      api.get("/companion/").then((response) => {
        this.companions = response.data
      });
    },
    inviteCompanion() {
      api.post("/companion/", this.form).then((response) => {
        this.companions.push(response.data);
        this.form = emptyForm();
      });
    },
    deleteCompanion(companion) {
      api.delete(`/companion/${companion.id}/`).then((response) => {
        this.companions = this.companions.filter(o=>o.id !== companion.id);
      });
    }
  },
  mounted() {
    this.loadCompanions();
  }
});
