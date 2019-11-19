import ClickOutside from "../../v-click-outside.js";
import {
  seatTypes,
  airlineIcon,
  placeToRequestValue,
  getAirlines,
  processFlight,
  getQuickLinksData,
  destinationTypes,
  maxStopsFilterOptions,
} from "../../utils.js";
import { airlineCodes } from "../../airlineCodes.js";

export const SearchForm = {
  delimiters: ["{(", ")}"],
  data() {
    return {
      backToForm: false,
      passengerSelectProgress: false,
      seatTypeSelectProgress: false,
      destinationTypeSelectProgress: false,
      destinationTypes,
      maxStopsFilterOptions,
      seatTypes,
      fullPageApplied: false
    };
  },

  methods: {
    airlineIcon,
    openSeatTypeSelect() {
      setTimeout(() => {
        this.seatTypeSelectProgress = true;
      }, 50);
    },
    closeSeatTypeSelect() {
      this.seatTypeSelectProgress = false;
    },
    selectSeatType(type) {
      this.setSeatType(type);
      this.closeSeatTypeSelect();
    },
    openPassengersForm() {
      setTimeout(() => {
        this.passengerSelectProgress = true;
      }, 50);
    },
    closePassengersForm() {
      if (this.passengerSelectProgress) {
        this.passengerSelectProgress = false;
      }
    },
    openDestinationType() {
      setTimeout(() => {
        this.destinationTypeSelectProgress = true;
      }, 50);
    },
    closeDestinationType() {
      this.destinationTypeSelectProgress = false;
    },
    selectDestinationType(dtypeId) {
      this.setDestinationType(dtypeId);
      this.closeDestinationType();
    },
    switchToForm() {
      this.backToForm = true;
    },
    increment(index) {
      this.updatePassengers({index, by: 1});
    },
    decrement(index) {
      this.updatePassengers({index, by: -1});
    },
    setDatePick() {
      let that = this;
      new Lightpick({
        field: document.getElementById("departure_date"),
        secondField: document.getElementById("return_date"),
        singleDate: false,
        onSelect(start, end) {
          that.setDates({start, end});
        }
      });
    },
    ...Vuex.mapActions(['search']),
    ...Vuex.mapMutations([
      "updatePlaceFrom",
      "updatePlaceTo",
      "setSeatType",
      "setDestinationType",
      "increaseLimit",
      "setSort",
      "setSearchResults",
      "setDates",
      "updatePassengers",
      "setQuickFiltersData",
    ]),
  },
  mounted() {
    this.setDatePick();
  },
  computed: {
    ...Vuex.mapState({
      user: "user",
      searchResults: "searchResults",
      form: "form",
      searchProgress: "searchProgress",
    }),
    passengersText() {
      return `${this.passengers} Passenger${this.passengers>1?'s':''}`;
    },
    isFormIncomplete() {
      if (this.form.destinationTypeId === "round") {
        if (!this.form.return_date) return true;
      }
      if (!this.form.departure_date) return true;
      return this.placeFrom === null || !this.placeTo === null;
    },
    showWideForm() {
      return (
        this.user.anonymous &&
        this.searchResults.length === 0 &&
        !this.searchProgress
      );
    },
    cityFromTo() {
      return `${this.form.placeFrom.name} -> ${this.form.placeTo.name}`;
    },
    airlineNames() {
      return this.form.airlines.map(e => e.name).join(", ");
    },
    isMobile() {
      return this.$mq === "sm";
    },
    maxStopsText() {
      return this.maxStopsFilterOptions[this.form.maxStops];
    },
    airlinesText() {
      return this.form.airlines
        .filter(a => a.checked)
        .map(a => a.name)
        .join(", ");
    },
    passengers() {
      return this.form.valAdults + this.form.valChildren + this.form.valInfants;
    }
  }
};
