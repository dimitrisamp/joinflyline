import {
  getQuickLinksData,
  getBaseSearchURL,
  processFlight,
  getAirlines,
  getFlightAirlines,
} from "../../utils.js";
import {airlineCodes, lowcostAirlines, legacyAirlines} from "../../airlineCodes.js";
import api from "../http.js";
import {userStorage} from "../store/user.js";

export const searchStore = {
  namespaced: true,
  state: {
    authErrorText: "",
    plans: null,
    form: {
      airlinesFilter: null,
      limit: 10,
      limitIncrement: 0,
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
    toggleSidebar: false,
    searchProgress: false,
    searchResultIndex: null,
    showDashboardNavigation: true
  },
  mutations: {
    setQuickFiltersData(state, value) {
      state.quickFiltersData = value;
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
      state.form.limitIncrement = 0;
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
      state.form.limitIncrement += by;
    },
    toggleSort(state, value) {
      if (state.form.sort === value) {
        state.form.sort = null;
      } else {
        state.form.sort = value;
      }
    },
    setDates(state, payload) {
      const {start, end} = payload;
      if (start) state.form.departure_date = start.format("MM/DD/YYYY");
      if (end) state.form.return_date = end.format("MM/DD/YYYY");
      state.form.departure_date_data = start;
      state.form.return_date_data = end;
    },
    updatePassengers(state, payload) {
      const {index, by} = payload;
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
      state.form = {...state.form, ...vals}; // Apply changes
    },
    setSearchProgress(state, value) {
      state.searchProgress = value;
    },
    setSearchResultIndex(state, value) {
      state.searchResultIndex = value;
    },
    setAirlines(state, value) {
      state.form.airlines = value;
    },
    setPlans(state, value) {
      state.plans = value;
    },
    resetAirlinesFilter(state, value) {
      state.form.airlinesFilter = null;
    },
    toggleAirlinesFilter(state, value) {
      if (state.form.airlinesFilter === value) {
        state.form.airlinesFilter = null;
      } else {
        state.form.airlinesFilter = value;
      }
    },
    setAuthError(state, value) {
      state.authErrorText = value;
    },
    showDashboardNav(state) {
      state.showDashboardNavigation = true
    },
    hideDashboardNav(state) {
      state.showDashboardNavigation = false
    },
    setForm(state, data) {

      state.form.placeFrom = data.place_from;
      state.form.placeTo = data.place_to;
      state.form.valAdults = data.adults;
      state.form.valChildren = data.children;
      state.form.valInfants = data.infants;
      state.form.seatType = data.seat_type;
      state.form.destinationTypeId = data.destination_type;
    },
  },
  actions: {
    setFormAndSearch(context, data) {
      context.commit("setForm", data);
      const departureDate = moment(data.departure_date);
      const returnDate = data.return_date ? moment(data.return_date) : null;
      context.commit("setDates", {start: departureDate, end: returnDate});
      context.dispatch("search", {clearFilters: true, saveSearch: false})
    },
    applyAirlinesFilter(context, kind) {
      context.commit("toggleAirlinesFilter", kind);
    },
    loadMore(context) {
      context.commit("increaseLimit", 10);
    },
    sortResultsBy(context, sort) {
      context.commit("toggleSort", sort);
    },
    clearFiltersAndUpdate(context) {
      context.commit("clearFilters");
      context.commit("resetAirlinesFilter");
    },
    search(context, payload) {
      const {clearFilters, saveSearch} = payload;
      context.commit('setSearchResultIndex', null);
      context.commit("setSearchProgress", true);
      api.get(getBaseSearchURL(context.state.form))
          .then(response => {
            const data = response.data;
            let parent = {...data};
            delete parent.data;
            data.data = data.data.map(processFlight);
            data.data = data.data.map((o, i) => {
              o.parent = parent;
              o.srIndex = i;
              return o;
            });
            const airlines = getAirlines(data.data);
            context.commit(
                "setAirlines",
                airlines.map((a, i) => ({
                  code: a,
                  name: airlineCodes[a] || a,
                  checked: false,
                  aIndex: i
                }))
            );
            context.commit("setSearchResults", data.data);
          })
          .finally(() => {
            context.commit("setSearchProgress", false);
          });
      if (saveSearch) {
        context.dispatch('saveSearchHistory');
      }
    },
    saveSearchHistory(context) {
      api.post('/search-history/', {
        place_from: context.state.form.placeFrom,
        place_to: context.state.form.placeTo,
        departure_date: context.state.form.departure_date_data.toJSON().slice(0, 10),
        return_date: context.state.form.return_date_data.toJSON().slice(0, 10),
        adults: context.state.form.valAdults,
        children: context.state.form.valChildren,
        infants: context.state.form.valInfants,
        seat_type: context.state.form.seatType,
        destination_type: context.state.form.destinationTypeId
      });
    },
  },
  getters: {
    quickFiltersData(state, getters) {
      return getQuickLinksData(getters.filteredResults);
    },
    toggleSidebar: state => state.toggleSidebar,
    filterableAirlines(state) {
      const kind = state.form.airlinesFilter;
      if (kind === 'lowcost') {
        return state.form.airlines.filter(o=>lowcostAirlines.includes(o.code))
      } else if (kind === 'legacy') {
        return state.form.airlines.filter(o=>legacyAirlines.includes(o.code))
      }
      return state.form.airlines;
    },
    checkedAirlines(state, getters) {
      return getters.filterableAirlines.filter(o=>o.checked).map(o=>o.code);
    },
    airlinesFilterToApply(state, getters) {
      const kind = state.form.airlinesFilter;
      if (getters.checkedAirlines.length > 0) {
        return getters.checkedAirlines;
      }
      if (kind === 'lowcost') {
        return lowcostAirlines;
      } else if (kind === 'legacy') {
        return legacyAirlines;
      }
      return [];
    },
    filteredResults(state, getters) {
      let result = state.searchResults;
      if (getters.airlinesFilterToApply.length > 0) {
        result = result.filter(o=>{
          const airlines = getFlightAirlines(o);
          return airlines.every(a=>getters.airlinesFilterToApply.includes(a));
        })
      }
      return result;
    },
    finalResults(state, getters) {
      return getters.filteredResults.slice(0, state.form.limit + state.form.limitIncrement);
    },
    airlinePrices(state, getters) {

    },
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
    },
    user(state) {
      return state.user
    },
    flightToBook(state) {
      if (state.searchResultIndex === null) return null;
      return state.searchResults[state.searchResultIndex];
    }
  }
};
