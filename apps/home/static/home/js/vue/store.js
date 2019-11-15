export const store = new Vuex.Store({
  state: {
    user: JSON.parse(document.getElementById("django_user").textContent),
    searchResults: [],
  },
  mutations: {
    updateUser(state, user) {
      state.user = user;
    },
    setSearchResults(state, results) {
      state.searchResults = results;
    }
  }
});
