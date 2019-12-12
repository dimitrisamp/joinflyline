import {PopupSelect} from "./popup-select.js";

export const SelectPassengerCount = Vue.component('select-passenger-count', {
  extends: PopupSelect,
  template: '#vue-select-passenger-count-template',
  delimiters: ['[[', ']]'],
  methods: {
    increment(index) {
      this.updatePassengers({index, by: 1});
    },
    decrement(index) {
      this.updatePassengers({index, by: -1});
    },
    ...Vuex.mapMutations('search', ['updatePassengers']),
  },
  computed: {
    ...Vuex.mapState('search', ['form']),
    passengers() {
      return this.form.valAdults + this.form.valChildren + this.form.valInfants;
    },
    text() {
      return `${this.passengers} Passenger${this.passengers > 1 ? 's' : ''}`;
    },
  }
});
