import { dashboardStore } from "./dashboard";
import { plansStore } from "./plans";
import { userStore } from "./user";
import { searchStore } from "./search";
import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    dashboard: dashboardStore,
    plans: plansStore,
    user: userStore,
    search: searchStore
  }
});
export default store;
