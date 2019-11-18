export const store = new Vuex.Store({
  state: {
    user: JSON.parse(document.getElementById("django_user").textContent),
    searchResults: [],
    toggleSidebar: false
  },
  mutations: {
    updateUser(state, user) {
      state.user = user;
    },
    setSearchResults(state, results) {
      state.searchResults = results;
    },
    TOGGLE_SIDEBAR(state) {
      state.toggleSidebar = !state.toggleSidebar
    }
  },
  actions: {
    toggleSidebar(context) {
      context.commit('TOGGLE_SIDEBAR');
    }
  },
  getters: {
    toggleSidebar: state => state.toggleSidebar
  }
});
