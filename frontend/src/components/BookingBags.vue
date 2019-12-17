<template>
  <div v-if="baggage" class="booking-bags">
    <div
      class="booking-bags__item"
      v-for="(combinationList, categoryName) in baggage.combinations"
      :key="`booking-bags-item-${categoryName}`"
    >
      <h3 class="booking-bags__heading">
        {{ categoryLabels[categoryName] }}<span>Select one option</span>
      </h3>
      <div class="booking-bags__combination-list">
        <div
          v-for="(combination, combinationIndex) in combinationList"
          :key="`combination-${combinationIndex}`"
          class="booking-bags__combination"
        >
          <input
            type="radio"
            :id="`${passengerIndex}-${categoryName}-${combinationIndex}`"
            :name="`${passengerIndex}-${categoryName}`"
            :value="combinationIndex"
            v-model="selectedCombinations[categoryName]"
          />
          <template v-if="combination.indices.length > 0">
            <label
              :for="`${passengerIndex}-${categoryName}-${combinationIndex}`"
            >
              <div class="booking-bags__bag-container">
                <div
                  class="booking-bags__bag-inner"
                  v-for="(definition, definitionIndex) in definitions(
                    combination
                  )"
                  :key="`definition-${definitionIndex}`"
                >
                  <div class="booking-bags__bag-label">
                    <span class="booking-bags__bag-radio" />
                    <svg
                      class="icon"
                      :class="'icon--' + iconClass(definition)"
                      width="24"
                      height="24"
                    >
                      <use :xlink:href="`#${iconClass(definition)}`" />
                    </svg>
                    <p class="booking-bags__bag-text">
                      {{ bagLabel(definition) }}
                    </p>
                  </div>
                  <p class="booking-bags__dimensions">
                    {{ dimensions(definition) }}
                  </p>
                </div>
              </div>
              <div class="booking-bags__combination-price">
                ${{ convertToUsd(combination.price.amount) }}
              </div>
            </label>
          </template>
          <template v-else>
            <label
              :for="`${passengerIndex}-${categoryName}-${combinationIndex}`"
            >
              <div class="booking-bags__bag-container">
                <div class="booking-bags__bag-inner">
                  <div class="booking-bags__bag-label">
                    <span class="booking-bags__bag-radio" />
                    <svg class="icon icon--no-bag" width="24" height="24">
                      <use xlink:href="#icon-no-bag" />
                    </svg>
                    <p class="booking-bags__bag-text">
                      {{ noneLabels[categoryName] }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="booking-bags__combination-price">
                ${{ convertToUsd(combination.price.amount) }}
              </div>
            </label>
          </template>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="booking-bags__loading">
    <p>Loading...</p>
  </div>
</template>

<script>
import { getAgeCategory } from "../utils/utils";

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

export default {
  props: ["baggage", "passenger", "convertToUsd", "passengerIndex"],
  data() {
    return {
      selectedCombinations: { ...this.passenger.combinations },
      categoryLabels,
      noneLabels
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
      return combination.conditions.passenger_groups.includes(
        this.passengerCategory
      );
    },
    dimensions(definition) {
      const r = definition.restrictions;
      return `${r.length}x${r.width}x${r.height}, ${r.weight} kg`;
    },
    bagLabel(definition) {
      return bagLabels[definition.category];
    },
    iconClass(definition) {
      return `${definition.category}`;
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
  delimiters: ["{{", "}}"],
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
    }
  }
};
</script>
