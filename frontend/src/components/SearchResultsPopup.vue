<template>
  <div
    class="modal bd-example-modal-sm fade"
    tabindex="-1"
    role="dialog"
    id="search-results-popup"
  >
    <div class="modal-dialog modal-sm flight-modal">
      <div class="modal-content flight-popup text-center">
        <button
          type="button"
          class="btn btn-secondary close-btn-popup"
          data-dismiss="modal"
        >
          Close
        </button>
        <h3>Login or join flyline to book this flight</h3>
        <p>
          Our exclusive deals and feesless flights are for flyline members, have
          an account, sign in, Not a member start today
        </p>
        <router-link
          :to="{ name: 'sign-in' }"
          v-on:click.native="removeBModalOverlay"
          class="btn btn-default"
          >Log In</router-link
        >
        <router-link
          data-dismiss="modal"
          v-on:click.native="removeBModalOverlay"
          :to="{ name: 'get-started' }"
          class="btn btn-default"
          >Get Started
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { removeBModalOverlay } from "../utils/utils";

export default {
  delimiters: ["{{", "}}"],
  methods: {
    removeBModalOverlay
  }
};
</script>
