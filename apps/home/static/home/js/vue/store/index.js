import {dashboardStore} from "./dashboard.js";
import {plansStore} from "./plans.js";
import {userStore} from './user.js'
import {searchStore} from "./search.js";


export const store = new Vuex.Store({
  modules: {
    dashboard: dashboardStore,
    plans: plansStore,
    user: userStore,
    search: searchStore
  }
});
