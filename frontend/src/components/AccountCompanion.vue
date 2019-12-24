<template>
  <div class="main-padding">
    <div class="account__form account__form--table">
      <div class="row">
        <div class="col-12 col-lg-10">
          <h3>Companions</h3>
          <table v-if="companions.length > 0">
            <thead>
              <tr>
                <th>Email</th>
                <th>Invited</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr v-for="companion in companions" :key="companion.email">
                <td>{{ companion.email }}</td>
                <td>{{ formatDateTime(companion.invited) }}</td>
                <td>{{ getStatusText(companion.status) }}</td>
                <td>
                  <button
                    v-if="companion.status !== 'active'"
                    type="button"
                    class="button button--red"
                    @click="deleteCompanion(companion)"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <p>Enter companion email:</p>
          <div class="row">
            <div class="col-12">
              <div class="row">
                <div class="col-12 col-lg-4">
                  <input
                    type="email"
                    class="form-control"
                    placeholder="Email"
                    v-model="form.email"
                  />
                </div>
                <div class="col-12 col-lg-8">
                  <button
                    type="button"
                    class="btn btn-primary invite-companion"
                    @click="inviteCompanion"
                  >
                    Invite
                  </button>
                  <span v-if="formError" class="account__form__errors">{{
                    formError
                  }}</span>
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
import api from "../utils/http";
import { formatDateTime } from "../utils/utils";

function emptyForm() {
  return {
    email: null
  };
}

const statusText = new Map([
  [0, "Created"],
  [1, "Email sent"],
  [2, "Active"]
]);

const errorDescription = {
  "limit-exceeded": "Companion limit has exceeded",
  "non-subscriber": "You are not subscriber so you can't invite",
  "existing-user": "The user is already registered"
};

export default {
  delimiters: ["{{", "}}"],
  data() {
    return {
      companions: [],
      form: emptyForm(),
      formError: null
    };
  },
  methods: {
    getStatusText(status) {
      return statusText.get(status);
    },
    formatDateTime,
    loadCompanions() {
      api.get("/companion/").then(response => {
        this.companions = response.data;
      });
    },
    inviteCompanion() {
      api
        .post("/companion/", this.form)
        .then(response => {
          this.companions.push(response.data);
          this.form = emptyForm();
        })
        .catch(e => {
          this.formError = errorDescription[e.response.data.error.code];
        });
    },
    deleteCompanion(companion) {
      api.delete(`/companion/${companion.id}/`).then(() => {
        this.companions = this.companions.filter(o => o.id !== companion.id);
      });
    }
  },
  mounted() {
    this.loadCompanions();
  }
};
</script>
