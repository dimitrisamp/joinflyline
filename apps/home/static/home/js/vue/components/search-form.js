import ClickOutside from "../../v-click-outside.js";
import {
  seatTypes,
  airlineIcon,
  placeToRequestValue,
  getAirlines,
  processFlight,
  getQuickLinksData,
} from "../../utils.js";
import {airlineCodes} from "../../airlineCodes.js";


export const SearchForm = Vue.extend({
  delimiters: ["{(", ")}"],
  data() {
    return {
      searchProgress: false,
      quickFiltersData: null,
      noOfPassengers: "Passengers",
      valPassengers: 1,
      seatTypeName: "Economy",
      destinationTypes: {round: "Round-trip", oneway: "One-way"},
      destinationTypeSelectProgress: false,
      passengerSelectProgress: false,
      seatTypeSelectProgress: false,
      maxStopsSelectProgress: false,
      backToForm: false,
      seatTypes,
      maxStopsFilterOptions: {
        0: "No Stops",
        1: "One Stop",
        2: "Two Stops"
      },
      airlinesSelectProgress: false,
      priceSelectProgress: false,
      fullPageApplied: false,
      form: {
        limit: 20,
        sort: null,
        priceRange: [0, 3000],
        airlines: [
        ],
        maxStops: null,
        noOfPassengers: "Passengers",
        destinationTypeId: "round",
        seatType: "M",
        valAdults: 1,
        valChildren: 0,
        valInfants: 0,
        departure_date: "",
        return_date: "",
        departure_date_data: null,
        return_date_data: null,
        placeFrom: null,
        placeTo: null,
      }
    };
  },
  directives: {
    ClickOutside
  },
  components: {
    VueSlider: window["vue-slider-component"]
  },
  methods: {
    updatePlaceFrom(value) {
      this.form.placeFrom = value
    },
    updatePlaceTo(value) {
      this.form.placeTo = value
    },
    clearFilters() {
      for (let a of this.form.airlines) {
        a.checked = false;
      }
      this.form.priceRange = [0, 3000];
      this.form.maxStops = null;
    },
    airlineIcon,
    openPriceSelect() {
      setTimeout(() => {
        this.priceSelectProgress = true;
      }, 150);
    },
    closePriceSelect() {
      this.priceSelectProgress = false;
    },
    openAirlinesSelect() {
      setTimeout(() => {
        this.airlinesSelectProgress = true;
      }, 150);
    },
    closeAirlinesSelect() {
      this.airlinesSelectProgress = false;
    },
    closeMaxStopsSelect() {
      this.maxStopsSelectProgress = false;
    },
    openMaxStopsSelect() {
      setTimeout(() => {
        this.maxStopsSelectProgress = true;
      }, 150);
    },
    selectMaxStops(maxStops) {
      this.form.maxStops = maxStops;
      this.closeMaxStopsSelect();
    },
    openSeatTypeSelect() {
      setTimeout(() => {
        this.seatTypeSelectProgress = true;
      }, 50);
    },
    closeSeatTypeSelect() {
      this.seatTypeSelectProgress = false;
    },
    selectSeatType(type) {
      this.form.seatType = type;
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
      this.form.destinationTypeId = dtypeId;
      this.closeDestinationType();
    },
    loadMore() {
      this.form.limit = this.form.limit + 10;
      this.search();
    },
    sortResultsBy(sort) {
      this.form.sort = sort;
      this.search();
    },
    setStopOverValue(stopOverTo, stopOverFrom) {
      this.form.stopOverFrom = stopOverFrom + ":" + "00";
      this.form.stopOverTo = stopOverTo + ":" + "00";
    },
    getSearchURL() {
      let formData = new FormData();

      if (document.getElementById("stopover") != null) {
        let stopSelected = document.getElementById("stopover").value;
        let chars = stopSelected.split(",");

        let stopOverTo;
        let stopOverFrom;

        if (chars[0].length === 1) {
          stopOverFrom = "0" + chars[0];
        } else {
          stopOverFrom = chars[0];
        }

        if (chars[1].length === 1) {
          stopOverTo = "0" + chars[1];
        } else {
          stopOverTo = chars[1];
        }

        this.setStopOverValue(stopOverTo, stopOverFrom);
      }

      formData.append("fly_from", placeToRequestValue(this.form.placeFrom));
      formData.append("fly_to", placeToRequestValue(this.form.placeTo));
      const dateFrom = this.form.departure_date_data.format("DD/MM/YYYY");
      formData.append("date_from", dateFrom);
      formData.append("date_to", dateFrom);
      formData.append("type", this.form.destinationTypeId);
      if (this.form.destinationTypeId === "round") {
        const dateTo = this.form.return_date_data.format("DD/MM/YYYY");
        formData.append("return_from", dateTo);
        formData.append("return_to", dateTo);
      }
      formData.append("adults", this.form.valAdults);
      formData.append("infants", this.form.valInfants);
      formData.append("children", this.form.valChildren);
      formData.append("selected_cabins", this.form.seatType);
      if (this.form.priceRange !== [0, 3000]) {
        const [price_from, price_to] = this.form.priceRange;
        formData.append("price_from", price_from);
        formData.append("price_to", price_to);
      }
      const selectedAirlines = this.form.airlines.filter(a => a.checked);
      if (selectedAirlines) {
        formData.append(
          "select_airlines",
          selectedAirlines.map(a => a.code).join(",")
        );
      }
      if (this.form.maxStops !== null) {
        formData.append("max_stopovers", this.form.maxStops);
      }
      if (this.form.sort !== null) {
        formData.append("sort", this.form.sort);
      }
      formData.append("limit", this.form.limit);
      formData.append("curr", "USD");
      let url = new URL(
        "https://kiwicom-prod.apigee.net/v2/search",
        window.location
      );
      url.search = new URLSearchParams(formData);
      return url;
    },
    switchToForm() {
      this.backToForm = true;
    },
    displaySearchResults(data) {
      if (this.searchResults.length === 0) {
        this.form.airlines = data.airlines.map(a => ({
          code: a,
          name: airlineCodes[a] || a,
          checked: false
        }));
      }
      this.$store.commit('setSearchResults', data.data.data);
    },
    search() {
      this.searchProgress = true;
      fetch(this.getSearchURL(), {
        headers: {apikey: "xklKtpJ5fxZnk4rsDepqOzLUaYYAO9dI"}
      })
        .then(response => response.json())
        .then(data => {
          let parent = {...data};
          delete parent.data;
          data.data = data.data.map(processFlight);
          data.data = data.data.map(o => {
            o.parent = parent;
            return o;
          });
          const airlines = getAirlines(data.data);
          this.quickFiltersData = getQuickLinksData(data.data);
          this.displaySearchResults({data, airlines});
          this.backToForm = false;
        })
        .finally(() => {
          this.searchProgress = false;
        });
    },
    increment(index) {
      this.valPassengers =
        this.form.valAdults + this.form.valChildren + this.form.valInfants;

      if (this.valPassengers !== 9) {
        switch (index) {
          case 1:
            if (this.form.valAdults !== 9) {
              this.form.valAdults++;
              this.valPassengers++;
            } else {
              document.getElementById("valAdultsIncrement").disable = true;
            }
            return;
          case 2:
            if (this.form.valChildren !== 8) {
              this.form.valChildren++;
              this.valPassengers++;
            } else {
              document.getElementById("valChildrenIncrement").disable = true;
            }
            return;
          case 3:
            if (this.form.valInfants !== this.form.valAdults) {
              this.form.valInfants++;
              this.valPassengers++;
            }
            return;
        }
      }
    },
    decrement(index) {
      this.valPassengers =
        this.form.valAdults + this.form.valChildren + this.form.valInfants;

      if (this.valPassengers !== 1) {
        switch (index) {
          case 1:
            if (this.form.valAdults !== 1) {
              this.form.valAdults--;
              this.valPassengers--;
              if (this.form.valInfants > this.form.valAdults) {
                this.valPassengers--;
                this.form.valInfants--;
              }
            } else {
              document.getElementById("valAdultsIncrement").disable = true;
            }
            return;
          case 2:
            if (this.form.valChildren !== 0) {
              this.form.valChildren--;
              this.valPassengers--;
            } else {
              document.getElementById("valChildrenIncrement").disable = true;
            }
            return;
          case 3:
            if (this.form.valInfants !== 0) {
              this.form.valInfants--;
              this.valPassengers--;
            } else {
              document.getElementById("valInfantsIncrement").disable = true;
            }
            return;
        }
      }
    },
    sumTotalsPassenger() {
      if (this.valPassengers === 1) {
        this.form.noOfPassengers = "Passengers";
      } else {
        this.form.noOfPassengers = this.valPassengers + " Passengers";
      }
    },
    setDatePick() {
      let that = this;
      new Lightpick({
        field: document.getElementById("departure_date"),
        secondField: document.getElementById("return_date"),
        singleDate: false,
        onSelect(start, end) {
          if (start) that.form.departure_date = start.format("MM/DD/YYYY");
          if (end) that.form.return_date = end.format("MM/DD/YYYY");
          that.form.departure_date_data = start;
          that.form.return_date_data = end;
        }
      });
    }
  },
  mounted() {
    this.setDatePick();
  },
  computed: {
    ...Vuex.mapState({
      user: "user",
      searchResults: 'searchResults',
    }),
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
    priceText() {
      const [a, b] = this.form.priceRange;
      return `$${a}-$${b}`;
    }
  }
});
