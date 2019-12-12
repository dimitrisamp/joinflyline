export const dashboardStore = {
  namespaced: true,
  state: {
    toggleSidebar: false,
    showDashboardNavigation: true
  },
  mutations: {
    TOGGLE_SIDEBAR(state) {
      state.toggleSidebar = !state.toggleSidebar;
    },
    showDashboardNav(state) {
      state.showDashboardNavigation = true
    },
    hideDashboardNav(state) {
      state.showDashboardNavigation = false
    },
  },
  actions: {
    toggleSidebar(context) {
      context.commit("TOGGLE_SIDEBAR");
    },
  },
  getters: {
    toggleSidebar: state => state.toggleSidebar,
  }
};
