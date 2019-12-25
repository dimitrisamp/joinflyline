<template>
  <div class="airlines">
    <header><nav-bar /></header>
    <div class="container mb-5">
      <div class="airlines__list">
        <h3>Flights to airports around the world</h3>
        <div class="airlines__header">
          <div class="airlines__code">Code</div>
          <div class="airlines__airline">Airline</div>
          <div class="airlines__phone">Phone</div>
        </div>
        <div
          v-for="(phone, code) in airlinePhones"
          class="airlines__item"
          :key="`phone-${code}`"
        >
          <div class="airlines__icon">
            <img :alt="code" :src="airlineIcon(code)" />
          </div>
          <div class="airlines__code">{{ code }}</div>
          <div class="airlines__link">{{ airlineCodes[code] }}</div>
          <div class="airlines__phone">{{ phone }}</div>
        </div>
      </div>
    </div>
    <footer>
      <main-landing-footer />
    </footer>
  </div>
</template>

<script>
import { airlineIcon } from "../utils/utils";
import { airlinePhones } from "../utils/airlinePhones";
import { airlineCodes } from "../utils/airlineCodes";
import MainLandingFooter from "./MainLandingFooter";
import NavBar from "./NavBar";

export default {
  data() {
    return {
      airlineCodes,
      airlinePhones,
      airlineIcon
    };
  },
  components: {
    "main-landing-footer": MainLandingFooter,
    NavBar
  },
  delimiters: ["{{", "}}"]
};
</script>
