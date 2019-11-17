import ClickOutside from "../../v-click-outside.js";
import {
  seatTypes,
  airlineIcon,
  locationSearch,
  debounce,
  formatPlace,
  placeToRequestValue,
} from "../../utils.js";
import {airlineCodes} from "../../airlineCodes.js";


function getCityInputData(k) {
  const jsonData = sessionStorage.getItem(`city${k}Input`);
  const data = JSON.parse(jsonData);
  if (data) return data;
  return {
    focused: false,
    searchResults: [],
    requestProgress: false,
    searchProgress: false,
    selectedIndex: 0,
    text: ""
  };
}

export const Home = Vue.component("home", {
  template: "#vue-home-template",
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
  watch: {
    searchResults: function (val, oldVal) {
      this.setDatePick();
    },
    $mq(val, oldVal) {
      if (val === oldVal) return;
      this.$nextTick(() => {
        if (val === "sm") {
          this.destroyFullPage();
        } else {
          this.applyFullPage();
        }
      });
    }
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
    clearList() {
      document.getElementById("mySelectedPlace").style.display = "block";
    },
    clearPlaceItem(index) {
      this.mySelection.splice(index, 1);
    },
    getSelectedRadioValue(item, index) {
      console.log(item);
      if (item.checked === true) {
        this.form.stop = item.value;
      }
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

      if (document.getElementsByName("stop") != null) {
        document.getElementsByName("stop").forEach(this.getSelectedRadioValue);
      }
      formData.append("fly_from", placeToRequestValue(this.placeFrom).fly_from);
      formData.append("fly_to", placeToRequestValue(this.placeTo));
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
    calculateLayovers(routes) {
      for (let i = 0; i < routes.length - 1; i++) {
        let [prev, next] = [routes[i], routes[i + 1]];
        prev.layover =
          (new Date(next.utc_departure).getTime() -
            new Date(prev.utc_arrival).getTime()) /
          1000;
      }
    },
    getAirlines(flights) {
      let airlines = new Set();
      for (const flight of flights) {
        for (const airline of flight.airlines) {
          airlines.add(airline);
        }
      }
      return [...airlines].sort();
    },
    processFlight(sr) {
      const to_routes = sr.route.filter(r => r.return === 0);
      const return_routes = sr.route.filter(r => r.return === 1);
      this.calculateLayovers(to_routes);
      this.calculateLayovers(return_routes);
      const roundtrip = return_routes.length > 0;
      const return_departure = roundtrip
        ? return_routes[0].local_departure
        : null;
      return {
        ...sr,
        roundtrip,
        return_departure
      };
    },
    switchToForm() {
      this.backToForm = true;
    },
    getQuickLinksData(flights) {
      const data = flights.map(f => ({
        price: f.conversion.USD,
        duration: f.duration.total,
        quality: f.quality,
        date: new Date(f.local_departure)
      }));
      return {
        price: data.reduce((prev, curr) =>
          prev.price < curr.price ? prev : curr
        ),
        duration: data.reduce((prev, curr) =>
          prev.duration < curr.duration ? prev : curr
        ),
        quality: data.reduce((prev, curr) =>
          prev.quality < curr.quality ? prev : curr
        ),
        date: data.reduce((prev, curr) => (prev.date < curr.date ? prev : curr))
      };
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
          data.data = data.data.map(this.processFlight);
          data.data = data.data.map(o => {
            o.parent = parent;
            return o;
          });
          const airlines = this.getAirlines(data.data);
          this.quickFiltersData = this.getQuickLinksData(data.data);
          this.displaySearchResults({data, airlines});
          this.backToForm = false;
        })
        .finally(() => {
          this.searchProgress = false;
        });
    },
    swapPlaces() {
      let city_from = this.form.city_from;
      this.form.city_from = this.form.city_to;
      this.form.city_to = city_from;
      let placeTo = this.form.placeTo;
      this.form.placeTo = this.form.placeFrom;
      this.form.placeFrom = placeTo;
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
    applyFullPage() {
      if (this.fullPageApplied) return;
      this.fullPageApplied = true;
      $("#fullpage").fullpage({
        scrollBar: true,
        navigation: true,
        normalScrollElements: ".normal-scroll",
        responsiveWidth: 768
      });
    },

    destroyFullPage() {
      if (this.fullPageApplied) {
        fullpage_api.destroy("all");
        this.fullPageApplied = false;
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
    this.$nextTick(() => {
      this.applyFullPage();
    });
    this.setDatePick();
    onMounted();
  },
  beforeDestroy() {
    this.destroyFullPage();
  },
  computed: Vuex.mapState({
    user: "user",
    searchResults: 'searchResults',
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
      return `${this.placeFrom.name} -> ${this.placeTo.name}`;
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
  })
});

function onMounted() {
  const sticky = 400;
  $(window).scroll(function () {
    if ($(window).scrollTop() > sticky) {
      $("header").addClass("sticky");
      $("#fp-nav").addClass("dots-display");
    } else {
      $("header").removeClass("sticky");
      $("#fp-nav").removeClass("dots-display");
    }
  });
}
