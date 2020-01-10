import {
  getQuickLinksData,
  processFlight,
  getAirlines,
  getStops,
  getSearchParams
} from "../utils/utils";

import {
  airlineCodes,
  lowcostAirlines,
  legacyAirlines
} from "../utils/airlineCodes";

import moment from "moment";
import api from "../utils/http";

function initialTimeFilters() {
  return {
    departure: {
      takeoff: [0, 24 * 60],
      landing: [0, 24 * 60]
    },
    return: {
      takeoff: [0, 24 * 60],
      landing: [0, 24 * 60]
    }
  };
}

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
      searchType: "searchNBook",
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
      singleCarrier: false,
      timeFilters: initialTimeFilters(),
      isDeals: false
    },
    searchResults: [],
    searchProgress: false,
    searchResultIndex: null,
    showDashboardNavigation: true
  },
  mutations: {
    SET_TIME_FILTERS(state, v) {
      const { destination, direction, value } = v;
      state.form.timeFilters[destination][direction] = value;
    },
    RESET_TIME_FILTERS(state) {
      state.form.timeFilters = initialTimeFilters();
    },
    SET_SINGLE_CARRIER(state) {
      state.form.singleCarrier = true;
    },
    TOGGLE_SINGLE_CARRIER(state) {
      state.form.singleCarrier = !state.form.singleCarrier;
    },
    setQuickFiltersData(state, value) {
      state.quickFiltersData = value;
    },
    setSearchResults(state, results) {
      state.searchResults = results;
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
    setSearchType(state, value) {
      state.form.searchType = value;
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
      const { start, end } = payload;
      if (start) state.form.departure_date = start.format("MM/DD/YYYY");
      if (end) state.form.return_date = end.format("MM/DD/YYYY");
      state.form.departure_date_data = start;
      state.form.return_date_data = end;
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
    setSearchResultIndex(state, value) {
      state.searchResultIndex = value;
    },
    setAirlines(state, value) {
      state.form.airlines = value;
    },
    setPlans(state, value) {
      state.plans = value;
    },
    resetAirlinesFilter(state) {
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
      state.showDashboardNavigation = true;
    },
    hideDashboardNav(state) {
      state.showDashboardNavigation = false;
    },
    setForm(state, data) {
      state.form = {
        ...state.form,
        placeFrom: data.place_from,
        placeTo: data.place_to,
        valAdults: data.adults,
        valChildren: data.children,
        valInfants: data.infants,
        seatType: data.seat_type,
        destinationTypeId: data.destination_type
      };
    }
  },
  actions: {
    toggleSingleCarrier(context) {
      context.commit("TOGGLE_SINGLE_CARRIER");
    },
    setSingleCarrier(context, value) {
      context.commit("SET_SINGLE_CARRIER", value);
    },
    setTimeFilters(context, value) {
      context.commit("SET_TIME_FILTERS", value);
    },
    setFormAndSearch(context, data) {
      context.commit("setForm", data);
      const departureDate = moment(data.departure_date);
      const returnDate = data.return_date ? moment(data.return_date) : null;
      context.commit("setDates", { start: departureDate, end: returnDate });
      context.dispatch("search", { clearFilters: true, saveSearch: false });
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
      context.commit("setPriceRange", [
        context.getters.priceLimits.min,
        context.getters.priceLimits.max
      ]);
      context.commit("resetAirlinesFilter");
      context.commit("RESET_TIME_FILTERS");
    },
    search(context, payload) {
      const { saveSearch } = payload;
      context.commit("setSearchResultIndex", null);
      context.commit("setSearchProgress", true);
      api
        .get("search", { params: getSearchParams(context.state.form) })
        .then(response => {
          const data = response.data;
          let parent = { ...data };
          delete parent.data;
          data.data = data.data.map(processFlight);
          data.data = data.data.map((o, i) => {
            o.parent = parent;
            o.srIndex = i;
            Object.freeze(o);
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
          context.commit("setPriceRange", [
            context.getters.priceLimits.min,
            context.getters.priceLimits.max
          ]);
        })
        .finally(() => {
          context.commit("setSearchProgress", false);
        });
      if (saveSearch) {
        context.dispatch("saveSearchHistory");
      }
    },
    saveSearchHistory(context) {
      api.post("/search-history/", {
        place_from: context.state.form.placeFrom,
        place_to: context.state.form.placeTo,
        departure_date: context.state.form.departure_date_data
          .toJSON()
          .slice(0, 10),
        return_date: context.state.form.return_date_data
          ? context.state.form.return_date_data.toJSON().slice(0, 10)
          : null,
        adults: context.state.form.valAdults,
        children: context.state.form.valChildren,
        infants: context.state.form.valInfants,
        seat_type: context.state.form.seatType,
        destination_type: context.state.form.destinationTypeId
      });
    }
  },
  getters: {
    quickFiltersData(state, getters) {
      return getQuickLinksData(getters.filteredResults);
    },
    filterableAirlines(state) {
      const kind = state.form.airlinesFilter;
      let result;
      if (kind === "lowcost") {
        result = state.form.airlines.filter(o =>
          lowcostAirlines.includes(o.code)
        );
      } else if (kind === "legacy") {
        result = state.form.airlines.filter(o =>
          legacyAirlines.includes(o.code)
        );
      } else {
        result = state.form.airlines;
      }
      if (state.form.singleCarrier) {
        const singleCarrierAirlines = new Set(
          state.searchResults
            .filter(o => o.airlines.length === 1)
            .map(o => o.airlines[0])
        );
        result = result.filter(o => singleCarrierAirlines.has(o.code));
      }
      return result;
    },
    checkedAirlines(state, getters) {
      return getters.filterableAirlines.filter(o => o.checked).map(o => o.code);
    },
    airlinesFilterToApply(state, getters) {
      const kind = state.form.airlinesFilter;
      if (getters.checkedAirlines.length > 0) {
        return getters.checkedAirlines;
      }
      if (kind === "lowcost") {
        return lowcostAirlines;
      } else if (kind === "legacy") {
        return legacyAirlines;
      }
      return [];
    },
    filteredResults(state, getters) {
      let result = [...state.searchResults];
      if (getters.airlinesFilterToApply.length > 0) {
        result = result.filter(o => {
          return o.airlines.every(a =>
            getters.airlinesFilterToApply.includes(a)
          );
        });
      }
      result = result.filter(o => {
        return (
          o.conversion.USD >= state.form.priceRange[0] &&
          o.conversion.USD <= state.form.priceRange[1]
        );
      });
      if (state.form.maxStops !== null) {
        result = result.filter(o => {
          return getStops(o) <= state.form.maxStops;
        });
      }
      result = result.filter(o => {
        const tf = state.form.timeFilters;
        if (o.roundtrip) {
          if (
            o.local_departure_int < tf.departure.takeoff[0] ||
            o.local_departure_int > tf.departure.takeoff[1]
          )
            return false;
          if (
            o.local_arrival_int < tf.departure.landing[0] ||
            o.local_arrival_int > tf.departure.landing[1]
          )
            return false;
          if (
            o.return_departure_int < tf.return.takeoff[0] ||
            o.return_departure_int > tf.return.takeoff[1]
          )
            return false;
          if (
            o.return_arrival_int < tf.return.landing[0] ||
            o.return_arrival_int > tf.return.landing[1]
          )
            return false;
          return true;
        } else {
          if (
            o.local_departure_int < tf.departure.takeoff[0] ||
            o.local_departure_int > tf.departure.takeoff[1]
          )
            return false;
          if (
            o.return_arrival_int < tf.return.landing[0] ||
            o.return_arrival_int > tf.return.landing[1]
          )
            return false;
          return true;
        }
      });
      if (state.form.singleCarrier) {
        result = result.filter(o => o.airlines.length === 1);
      }
      if (state.form.sort) {
        if (state.form.sort === "price") {
          result.sort((a, b) => {
            if (a.conversion.USD > b.conversion.USD) return 1;
            if (a.conversion.USD === b.conversion.USD) {
              if (a.quality > b.quality) return 1;
              if (a.quality === b.quality) return 0;
              if (a.quality < b.quality) return -1;
            }
            return -1;
          });
        } else if (state.form.sort === "quality") {
          result.sort((a, b) => {
            if (a.quality > b.quality) return 1;
            if (a.quality === b.quality) {
              if (a.price > b.price) return 1;
              if (a.price === b.price) return 0;
              return -1;
            }
            return -1;
          });
        } else if (state.form.sort === "duration") {
          result.sort((a, b) => {
            const adur = Math.min(
              ...[a.duration.departure, a.duration.return].filter(o => o)
            );
            const bdur = Math.min(
              ...[b.duration.departure, b.duration.return].filter(o => o)
            );
            if (adur > bdur) return 1;
            if (adur === bdur) {
              if (a.price > b.price) return 1;
              if (a.price === b.price) return 0;
              return -1;
            }
            return -1;
          });
        }
      }
      return result;
    },
    priceLimits(state) {
      const prices = state.searchResults.map(o => o.conversion.USD);
      return {
        min: Math.min(...prices),
        max: Math.max(...prices)
      };
    },
    finalResults(state, getters, rootState, rootGetters) {
      const limit = rootGetters["user/user"].anonymous
        ? 4
        : state.form.limit + state.form.limitIncrement;
      return getters.filteredResults.slice(0, limit);
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
      return state.user;
    },
    flightToBook(state) {
      if (state.searchResultIndex === null) return null;
      return state.searchResults[state.searchResultIndex];
    },
    returnFlights(state, getters) {
      return getters.flightToBook
        ? getters.flightToBook.route.filter(o => o.return === 1)
        : [];
    },
    departureFlights(state, getters) {
      return getters.flightToBook
        ? getters.flightToBook.route.filter(o => o.return === 0)
        : [];
    },
    singleCarrierAirlines(state) {
      const singleCarrierAirlines = new Set(
        state.searchResults
          .filter(o => o.airlines.length === 1)
          .map(o => o.airlines[0])
      );
      return [...singleCarrierAirlines];
    }
  }
};
