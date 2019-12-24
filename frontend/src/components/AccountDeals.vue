<template>
  <div class="main-padding">
    <div class="account__form account__form--table">
      <div class="row">
        <div class="col-12 col-lg-10">
          <h3>Deal Alert Notifications</h3>
          <table v-if="dealWatches.length > 0">
            <thead>
              <tr>
                <th>Destination</th>
                <th>Max price</th>
                <th>Airlines</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr v-for="(dw, i) in dealWatches" :key="`deal-watch-${i}`">
                <td>{{ formatPlace(dw.destination) }}</td>
                <td>{{ dw.max_price }}</td>
                <td>{{ formatAirlines(dw.airlines) }}</td>
                <td>
                  <button
                    type="button"
                    class="button button--red"
                    @click="deleteDealWatch(dw)"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <p>Enter your notification parameters and your good to go</p>
          <div class="row">
            <div class="col-12">
              <div class="row">
                <div class="col-12 col-lg-4">
                  <location-input
                    :prompt="'Destination'"
                    :search-type="'both'"
                    :initial-value="form.destination"
                    @place-selected="updateDestination"
                  />
                </div>
                <div class="col-12 col-lg-3">
                  <input
                    type="number"
                    class="form-control"
                    placeholder="Max Price"
                    v-model="form.max_price"
                  />
                </div>
                <div class="col-12 col-lg-5">
                  <multiselect
                    v-model="form.airlines"
                    :options="airlineCodes"
                    :multiple="true"
                    :close-on-select="false"
                    :clear-on-select="false"
                    :preserve-search="true"
                    label="label"
                    track-by="label"
                  >
                  </multiselect>
                </div>
                <div class="col-12">
                  <div class="text-right">
                    <button
                      type="button"
                      class="btn btn-primary"
                      @click="addDealWatch"
                    >
                      Add
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
import api from "../utils/http";
import { airlineCodes } from "../utils/airlineCodes";
import { formatPlace } from "../utils/utils";
import LocationInput from "./LocationInput";
import { Multiselect } from "vue-multiselect";

function emptyForm() {
  return {
    destination: null,
    max_price: null,
    airlines: []
  };
}

export default {
  delimiters: ["{{", "}}"],
  components: {
    LocationInput,
    Multiselect
  },
  data() {
    let options = Object.entries(airlineCodes)
      .map(o => {
        let [code, label] = o;
        return { code, label };
      })
      .sort((a, b) => {
        if (a.label > b.label) return 1;
        if (a.label === b.label) return 0;
        return -1;
      });
    return {
      dealWatches: [],
      form: emptyForm(),
      airlineCodes: options
    };
  },
  methods: {
    formatPlace,
    formatAirlines(airlines) {
      return airlines.map(o => airlineCodes[o]).join(", ");
    },
    loadDealWatches() {
      api.get("/deal-watch/").then(response => {
        this.dealWatches = response.data;
      });
    },
    addDealWatch() {
      let params = {
        ...this.form,
        airlines: this.form.airlines.map(o => o.code)
      };
      api.post("/deal-watch/", params).then(response => {
        this.dealWatches.push(response.data);
        this.form = emptyForm();
      });
    },
    deleteDealWatch(dw) {
      api.delete(`/deal-watch/${dw.id}/`).then(() => {
        this.dealWatches = this.dealWatches.filter(o => o.id !== dw.id);
      });
    },
    updateDestination(data) {
      this.form.destination = data;
    }
  },
  mounted() {
    this.loadDealWatches();
  }
};
</script>
