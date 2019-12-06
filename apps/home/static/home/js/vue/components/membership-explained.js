export const MembershipExplained = Vue.component("membership-explained", {
  template: "#vue-membership-explained-template",
  delimiters: ["[[", "]]"],
  data() {
    return {
      tabs: [
        {
          title: "0 - 6 Round Trips",
          plan: "basic",
          builtFor: ['Leisure Travelers', 'Solo Travelers', 'Solo Travelers']
        },
        {
          title: "6 - 9 Round Trips",
          plan: "basic-plus",
          builtFor: ['Leisure Travelers', 'Light Business Travel', 'Light Business Travel', 'Couples and individuals that traveling together']
        },
        {
          title: "9+ Round Trips",
          plan: "pro",
          builtFor: ['Business Travel', 'Active Leisure Travelers']
        }
      ],
      selectedIndex: 0,
    };
  },
  computed: {
    ...Vuex.mapState(['plans']),
  }
});
