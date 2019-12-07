import api from "../http.js";
import {formatDateTime} from "../../utils.js";

function emptyForm() {
  return {
    email: null,
  }
}

export const AccountCompanion = Vue.component('account-companion', {
  template: '#vue-account-companion-template',
  delimiters: ['[[', ']]'],
  data() {
    return {
      companions: [
        {
          email: "admin@admin.com",
          invited: "2019-12-28T06:00:00Z",
          status: "active",
        },
        {
          email: "admin2@admin.com",
          invited: "2019-12-30T00:00:00Z",
          status: "active",
        }
      ],
      form: emptyForm(),
    };
  },
  methods: {
    formatDateTime,
    loadCompanions() {
      api.get("/companion/").then((response) => {
        this.companions = response.data
      });
    },
    inviteCompanion() {
      let params = {...this.form};
      api.post("/companion/", params).then((response) => {
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
    //this.loadCompanions();
  }
});
