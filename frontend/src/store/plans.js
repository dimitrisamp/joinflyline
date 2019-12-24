import api from "../utils/http";

export const plansStore = {
  namespaced: true,
  state: {
    plans: null
  },
  mutations: {
    setPlans(state, value) {
      state.plans = value;
    }
  },
  actions: {
    initializePlans(context) {
      api.get("/subscriptions/plan/").then(response => {
        context.commit("setPlans", response.data);
      });
    }
  }
};
