export const store = new Vuex.Store({
  state: {
    user: JSON.parse(document.getElementById("django_user").textContent),
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
      placeTo: null,
    },
    searchResults: [],
    quickFiltersData: null,
    toggleSidebar: false
  },
  mutations: {
    setQuickFiltersData (state, value) {
      state.quickFiltersData = value;
    },
    updateUser(state, user) {
      state.user = user;
    },
    setSearchResults(state, results) {
      state.searchResults = results;
    },
    TOGGLE_SIDEBAR(state) {
      state.toggleSidebar = !state.toggleSidebar
    },
    updatePlaceFrom(state, value) {
      state.form.placeFrom = value
    },
    updatePlaceTo(state, value) {
      state.form.placeTo = value
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
      state.form.destinationType = value;
    },
    increaseLimit(state, by) {
      state.form.limit += by;
    },
    setSort(state, value) {
      state.form.sort = value;
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
        valInfants: state.form.valInfants,
      };
      const propertyName = ['valAdults', 'valChildren', 'valInfants'][index-1];
      vals[propertyName] += by;
      const passengers = vals.valAdults + vals.valChildren + vals.valInfants;
      if (!((passengers > 0) && (passengers <= 9))) return;
      if (vals.valInfants > vals.valAdults) return;
      if (vals.valInfants > 0 && vals.valChildren > 0 && vals.valAdults === 0) return;
      state.form = {...state.form, ...vals}; // Apply changes
    }
  },
  actions: {
    toggleSidebar(context) {
      context.commit('TOGGLE_SIDEBAR');
    }
  },
  getters: {
    toggleSidebar: state => state.toggleSidebar
  },
});
