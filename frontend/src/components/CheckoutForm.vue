<template>
  <div class="checkout">
    <div class="top-progress">
      <div
        class="top-progress__indicator"
        :class="{ busy: bookingProgress }"
      ></div>
    </div>
    <h3 class="checkout__heading">Check Out</h3>
    <div class="checkout__row">
      <label for="promocode">Promo Code</label>
      <input
        class="form-control"
        id="promocode"
        type="text"
        v-model="form.promocode"
      />
    </div>

    <div class="checkout__row">
      <label for="holder_name">Name on Card</label>
      <input
        class="form-control"
        id="holder_name"
        type="text"
        v-model="form.holder_name"
      />
    </div>

    <div class="checkout__row">
      <label for="card_number">Credit Card Number</label>
      <input
        class="form-control"
        id="card_number"
        type="text"
        v-model="form.card_number"
      />
    </div>

    <div class="checkout__row checkout__row--container">
      <div class="checkout__column">
        <label for="expiry">Exp Date</label>
        <input
          class="form-control"
          id="expiry"
          type="text"
          v-model="form.expiry"
        />
      </div>

      <div class="checkout__column">
        <label for="credit-card-cvv">CCV</label>
        <input
          id="credit-card-cvv"
          class="form-control"
          type="text"
          v-model="form.credit_card_cvv"
        />
      </div>
    </div>

    <div class="checkout__row">
      <label for="email">E-Mail</label>
      <input id="email" class="form-control" type="text" v-model="form.email" />
      <span v-if="emailExists" class="checkout__email-warning"
        >User with this email already exists. Please sign-in</span
      >
    </div>

    <div class="checkout__row">
      <label for="phone">Phone</label>
      <input id="phone" class="form-control" type="text" v-model="form.phone" />
    </div>

    <div class="checkout__row--submit">
      <button
        class="button button--big button--outline-blue"
        :disabled="bookingProgress"
        @click="book"
      >
        Book Flight For ${{ total_price }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["form", "total_price", "bookingProgress", "canBook", "emailExists"],
  methods: {
    book() {
      this.$emit("book");
    }
  },
  delimiters: ["{{", "}}"],
  computed: {
    bookDisabled() {
      return !this.canBook;
    }
  }
};
</script>
