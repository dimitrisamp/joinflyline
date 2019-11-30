import { getAgeCategory } from "../../utils.js";

const noneLabels = {
  hand_bag: "No hand baggage",
  hold_bag: "No checked baggage"
};

const bagLabels = {
  personal_item: "Personal Item",
  cabin_bag: "Cabin Bag",
  hold_bag: "Checked Bag"
};

const categoryLabels = {
  hand_bag: "Carry-On",
  hold_bag: "Checked Baggage"
};


export const BookingBags = Vue.component("booking-bags", {
  props: ["baggage", "passenger", "convertToUsd"],
  data() {
    return {
      selectedCombinations: {...this.passenger.combinations},
      categoryLabels,
    };
  },
  methods: {
    definitions(combination) {
      const indices = combination.indices;
      const definitions = this.baggage.definitions[combination.category];
      let result = [];
      for (const i of indices) {
        result.push(definitions[i]);
      }
      return result;
    },
    isValidCombination(combination) {
      return combination.conditions.passenger_groups.includes(this.passengerCategory);
    },
    dimensions(definition) {
      const r = definition.restrictions;
      return `${r.length}x${r.width}x${r.height}, ${r.weight} kg`
    },
    bagLabel(definition) {
      return bagLabels[definition.category];
    },
    iconClass(definition) {
      return `${definition.category}`
    }
  },
  watch: {
    selectedCombinations: {
      handler(val) {
        this.$emit("baggage-updated", val);
      },
      deep: true
    }
  },
  template: "#vue-booking-bags-template",
  delimiters: ["[[", "]]"],
  computed: {
    passengerCategory() {
      return getAgeCategory(this.passenger, true);
    },
    combinations() {
      let passengerCategory = getAgeCategory(this.passenger);
      let result = {};
      for (let [bagCategory, data] of Object.entries(
        this.baggage.combinations
      )) {
        result[bagCategory] = data.filter(o =>
          o.conditions.passenger_groups.includes(passengerCategory)
        );
      }
      return result;
    },
  }
});
