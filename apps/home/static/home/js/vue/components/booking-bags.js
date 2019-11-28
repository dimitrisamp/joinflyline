const noneLabels = {
  hand_bag: 'No hand baggage',
  hold_bag: 'No checked baggage'
};

const bagLabels = {
  'personal_item': "Personal Item",
  'cabin_bag': "Cabin Bag",
  'hold_bag': "Checked Bag",
};

const categoryLabels = {
  hand_bag: 'Carry-On',
  hold_bag: 'Checked Baggage'
};

function transformBaggage(baggage) {
  let result = {};
  for (const [bagCategory, combinations] of Object.entries(baggage.combinations)) {
    let definitions = baggage.definitions[bagCategory];
    let categoryCombinations = [];
    for (const combination of combinations) {
      let combinationOptions = {};
      let optionItems = [];
      if (combination.indices.length === 0) {
        optionItems.push({
          'iconClass': 'icon-none',
          'label': noneLabels[bagCategory],
          'dimensions': '',
        });
      } else {
        for (const definitionIndex of combination.indices) {
          const definition = definitions[definitionIndex];
          const r = definition.restrictions;
          optionItems.push({
            'iconClass': `icon-${definition.category}`,
            'label': bagLabels[definition.category],
            'dimensions': `${r.length}x${r.width}x${r.height}, ${r.weight} kg`,
          });
        }
        combinationOptions.items = optionItems;
        combinationOptions.price = combination.price.amount;
      }
      categoryCombinations.push(combinationOptions);
    }
    result[bagCategory] = categoryCombinations;
  }
  return result;
}

export const BookingBags = Vue.component("booking-bags", {
  props: ["baggage"],
  data() {
    return {
      selectedCombinations: {
        hand_bag: 0,
        hold_bag: 0
      },
      categoryLabels,
    }
  },
  watch: {
    selectedCombinations: {
      handler(val) {
        let result = {};
        for (let [categoryName, value] of Object.entries(val)) {
          result[categoryName] = this.data[categoryName][value];
        }
        this.$emit('baggage-updated', result);
      },
      deep: true,
    }
  },
  template: "#vue-booking-bags-template",
  delimiters: ["[[", "]]"],
  computed: {
    data() {
      if (!this.baggage) return null;
      return transformBaggage(this.baggage);
    }
  }
});
