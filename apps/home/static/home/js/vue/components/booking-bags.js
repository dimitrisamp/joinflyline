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

function transformBaggage(baggage) {
  let result = {};
  for (const [bagCategory, combinations] of Object.entries(
    baggage.combinations
  )) {
    let definitions = baggage.definitions[bagCategory];
    let categoryCombinations = [];
    for (const combination of combinations) {
      let combinationOptions = {};
      let optionItems = [];
      if (combination.indices.length === 0) {
        optionItems.push({
          iconClass: "icon-none",
          label: noneLabels[bagCategory],
          dimensions: ""
        });
      } else {
        for (const definitionIndex of combination.indices) {
          const definition = definitions[definitionIndex];
          const r = definition.restrictions;
          optionItems.push({
            iconClass: `icon-${definition.category}`,
            label: bagLabels[definition.category],
            dimensions: `${r.length}x${r.width}x${r.height}, ${r.weight} kg`
          });
        }
        combinationOptions.items = optionItems;
        combinationOptions.price = combination.price.amount;
      }
      categoryCombinations.push(combinationOptions);
    }
    categoryCombinations.sort((cca, ccb) => {
      return (
        (cca.items ? cca.items.length : 0) - (ccb.items ? ccb.items.length : 0)
      );
    });
    result[bagCategory] = categoryCombinations;
  }
  return result;
}

export const BookingBags = Vue.component("booking-bags", {
  props: ["baggage", "passenger"],
  data() {
    return {
      selectedCombinations: {
        hand_bag: 0,
        hold_bag: 0
      },
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
        let result = {};
        for (let [categoryName, value] of Object.entries(val)) {
          result[categoryName] = this.data[categoryName][value];
        }
        this.$emit("baggage-updated", result);
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
    // data() {
    //   if (!this.baggage) return null;
    //   return transformBaggage(this.baggage);
    // }
  }
});
