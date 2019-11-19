import {
  getAirlines,
  getQuickLinksData,
  getSearchURL,
  processFlight
} from "../utils.js";
import { airlineCodes } from "../airlineCodes.js";

export const store = new Vuex.Store({
  state: {
    user: {},
    plans: {},
    form: {
      limit: 20,
      sort: null,
      priceRange: [0, 3000],
      airlines: [],
      maxStops: null,
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
      placeTo: null
    },
    searchResults: [],
    quickFiltersData: null,
    toggleSidebar: false,
    searchProgress: false
  },
  mutations: {
    setQuickFiltersData(state, value) {
      state.quickFiltersData = value;
    },
    updateUser(state, user) {
      state.user = user;
    },
    setSearchResults(state, results) {
      state.searchResults = results;
    },
    TOGGLE_SIDEBAR(state) {
      state.toggleSidebar = !state.toggleSidebar;
    },
    updatePlaceFrom(state, value) {
      state.form.placeFrom = value;
    },
    updatePlaceTo(state, value) {
      state.form.placeTo = value;
    },
    clearFilters(state) {
      for (let a of state.form.airlines) {
        a.checked = false;
      }
      state.form.priceRange = [0, 3000];
      state.form.maxStops = null;
    },
    setMaxStops(state, value) {
      state.form.maxStops = value;
    },
    setSeatType(state, value) {
      state.form.seatType = value;
    },
    setPriceRange(state, value) {
      state.form.priceRange = value;
    },
    toggleAirline(state, index) {
      state.form.airlines[index].checked = !state.form.airlines[index].checked;
    },
    setDestinationType(state, value) {
      state.form.destinationTypeId = value;
    },
    increaseLimit(state, by) {
      state.form.limit += by;
    },
    setSort(state, value) {
      state.form.sort = value;
    },
    setDates(state, payload) {
      const { start, end } = payload;
      if (start) state.form.departure_date = start.format("MM/DD/YYYY");
      if (end) state.form.return_date = end.format("MM/DD/YYYY");
      state.form.departure_date_data = start;
      state.form.return_date_data = end;
    },
    setUser(state, user) {
      state.user = user;
    },
    updatePassengers(state, payload) {
      const { index, by } = payload;
      let vals = {
        valAdults: state.form.valAdults,
        valChildren: state.form.valChildren,
        valInfants: state.form.valInfants
      };
      const propertyName = ["valAdults", "valChildren", "valInfants"][
        index - 1
      ];
      vals[propertyName] += by;
      const passengers = vals.valAdults + vals.valChildren + vals.valInfants;
      if (!(passengers > 0 && passengers <= 9)) return;
      if (vals.valInfants > vals.valAdults) return;
      if (vals.valInfants > 0 && vals.valChildren > 0 && vals.valAdults === 0)
        return;
      state.form = { ...state.form, ...vals }; // Apply changes
    },
    setSearchProgress(state, value) {
      state.searchProgress = value;
    },
    setAirlines(state, value) {
      state.form.airlines = value;
    },
    setPlans(state, value) {
      state.plans = value;
    },
  },
  actions: {
    initialize(context) {
      this.dispatch('initializeUser');
      this.dispatch('initializePlans');
    },
    initializeUser(context) {
      fetch("/api/users/me/")
        .then(response => {
          if (response.status === 404) {
            return { anonymous: true };
          }
          return response.json();
        })
        .then(data => context.commit("setUser", data));
    },
    initializePlans(context) {
      fetch("/subscriptions/plan/")
        .then(response => response.json())
        .then(data => context.commit("setPlans", data));
    },
    toggleSidebar(context) {
      context.commit("TOGGLE_SIDEBAR");
    },
    loadMore(context) {
      context.commit("increaseLimit", 10);
      this.dispatch("search");
    },
    sortResultsBy(context, sort) {
      context.commit("setSort", sort);
      this.dispatch("search");
    },
    clearFiltersAndUpdate(context) {
      context.commit("clearFilters");
      this.dispatch("search");
    },
    search(context) {
      context.commit("setSearchProgress", true);
      fetch(getSearchURL(context.state.form), {
        headers: { apikey: "xklKtpJ5fxZnk4rsDepqOzLUaYYAO9dI" }
      })
        .then(response => response.json())
        .then(data => {
          let parent = { ...data };
          delete parent.data;
          data.data = data.data.map(processFlight);
          data.data = data.data.map(o => {
            o.parent = parent;
            return o;
          });

          context.commit("setQuickFiltersData", getQuickLinksData(data.data));
          if (context.state.searchResults.length === 0) {
            const airlines = getAirlines(data.data);
            context.commit(
              "setAirlines",
              airlines.map(a => ({
                code: a,
                name: airlineCodes[a] || a,
                checked: false
              }))
            );
          }
          context.commit("setSearchResults", data.data);
        })
        .finally(() => {
          context.commit("setSearchProgress", false);
        });
    }
  },
  getters: {
    toggleSidebar: state => state.toggleSidebar,
    cityFromTo(state) {
      if (!state.form.placeFrom || !state.form.placeTo) {
        return null;
      }
      return `${state.form.placeFrom.name} -> ${state.form.placeTo.name}`;
    },
    airlineNames(state) {
      if (!(state.form.airlines && state.form.airlines.length > 0)) return null;
      const airlines = state.form.airlines.map(o => o.name);
      const others = airlines.length - 3;
      const airlinesText = airlines.slice(0, 3).join(", ");
      if (others > 0) {
        return `${airlinesText} and ${others} more`;
      }
      return airlinesText;
    }
  }
});
