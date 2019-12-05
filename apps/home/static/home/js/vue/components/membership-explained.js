export const MembershipExplained = Vue.component("membership-explained", {
  template: "#vue-membership-explained-template",
  delimiters: ["[[", "]]"],
  data() {
    return {
      tabs: [
        {
          title: "0 - 6 Round Trips",
          plan: "basic"
        },
        {
          title: "6 - 9 Round Trips",
          plan: "basic-plus"
        },
        {
          title: "9+ Round Trips",
          plan: "pro"
        }
      ],
      selectedIndex: 0,
    };
  },
  computed: {
    ...Vuex.mapState(['plans']),
  }
});
