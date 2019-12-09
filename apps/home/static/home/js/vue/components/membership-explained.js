export const MembershipExplained = Vue.component("membership-explained", {
  template: "#vue-membership-explained-template",
  delimiters: ["[[", "]]"],
  data() {
    return {
      tabs: [
        {
          title: "0 - 6 Bookings",
          plan: "basic",
          builtFor: ['Leisure Travelers', 'Solo Travelers', 'Small Family Trip']
        },
        {
          title: "6 - 9 Bookings",
          plan: "basic-plus",
          builtFor: ['Leisure Travelers', 'Light Business Travel', 'Small Family Trip', 'Couples and individuals traveling together']
        },
        {
          title: "9+ Bookings",
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
