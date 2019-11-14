export const store = new Vuex.Store({
  state: {
    user: JSON.parse(document.getElementById("django_user").textContent),
  },
  mutations: {
    updateUser(state, user) {
      state.user = user;
    }
  }
});
