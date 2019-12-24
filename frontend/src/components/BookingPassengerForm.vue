<template>
  <div class="pform">
    <div class="pform__heading">
      <h3 class="pform__header">
        {{ p.isPrimary ? "Primary Passenger" : "Secondary Passenger" }}
      </h3>
      <div class="pform__alert">
        Use all first names and last names exactly as they appear in your
        passport or ID to avoid boarding complications
      </div>
    </div>
    <div class="row">
      <div class="col-12 col-lg-2">
        <div class="pform__field">
          <label>Title</label>
          <div class="form-control__select">
            <select class="form-control form-control--select" v-model="p.title">
              <option value="0">Select gender</option>
              <option value="mr">mr</option>
              <option value="ms">ms</option>
            </select>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-5">
        <div class="pform__field">
          <label>Given names</label>
          <input
            class="form-control"
            type="text"
            v-model="p.name"
            placeholder="e.g Johnny Apple"
          />
        </div>
      </div>
      <div class="col-12 col-lg-5">
        <div class="pform__field">
          <label>Surname(s)</label>
          <input
            class="form-control"
            type="text"
            v-model="p.surname"
            name="surname"
            placeholder="e.g. Seed"
          />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 col-lg-4">
        <div class="pform__field">
          <label>Nationality</label>
          <div class="form-control__select">
            <select
              class="form-control form-control--select"
              name="nationality"
              v-model="p.nationality"
            >
              <option
                v-for="(label, countryCode) in isoCountries"
                :value="countryCode"
                :key="countryCode"
                >{{ label }}</option
              >
            </select>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-8">
        <div class="pform__field">
          <label>Birthdate</label>
          <div class="row">
            <div class="col-12 col-lg-4">
              <div class="form-control__select">
                <select
                  class="form-control form-control--select"
                  v-model="p.month"
                >
                  <option
                    v-for="(label, index) in months"
                    :value="index + 1"
                    :key="`month-${index}`"
                    >{{ label }}</option
                  >
                </select>
              </div>
            </div>
            <div class="col-12 col-lg-4">
              <div class="form-control__select">
                <select
                  class="form-control form-control--select"
                  v-model="p.day"
                >
                  <option v-for="i in 31" :value="i" :key="i">{{ i }}</option>
                </select>
              </div>
            </div>
            <div class="col-12 col-lg-4">
              <div class="form-control__select">
                <select
                  class="form-control form-control--select"
                  v-model="p.year"
                >
                  <option v-for="i in 100" :value="2019 - i" :key="2019 - i">{{
                    2019 - i
                  }}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 col-lg-9">
        <div class="pform__field">
          <label>Passport/ID number</label>
          <input class="form-control" type="text" v-model="p.cardno" />
        </div>
      </div>
      <div class="col-12 col-lg-3">
        <div class="pform__field">
          <label>Expiration</label>
          <input
            class="form-control"
            type="text"
            v-model="p.expiration"
            placeholder="2020-12-28"
          />
        </div>
      </div>
    </div>
    <booking-bags
      :baggage="!!checkFlightData ? checkFlightData.baggage : null"
      :passenger="p"
      :convert-to-usd="convertToUsd"
      :passenger-index="passengerIndex"
      @baggage-updated="updateBaggage"
    />
  </div>
</template>

<script>
import { isoCountries } from "../utils/countries";
import BookingBags from "./BookingBags";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

export default {
  props: ["checkFlightData", "passenger", "convertToUsd", "passengerIndex"],
  data() {
    let passengerData = { ...this.$props.passenger };
    return {
      isoCountries,
      months,
      p: passengerData
    };
  },
  components: {
    "booking-bags": BookingBags
  },
  watch: {
    p: {
      handler(val) {
        this.$emit("passenger-updated", val);
      },
      deep: true
    }
  },
  methods: {
    updateBaggage(data) {
      this.$set(this.p, "combinations", data);
    }
  },
  delimiters: ["{{", "}}"]
};
</script>
