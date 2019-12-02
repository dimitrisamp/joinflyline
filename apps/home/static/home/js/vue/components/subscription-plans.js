export const SubscriptionPlans = Vue.component("subscription-plans", {
  template: "#vue-subscription-plans-template",
  delimiters: ["[[", "]]"],
  data() {
    return {
      planTabs: [
        {group: "basic", label: "FlyLine Basic", label_mobile: "Basic", plans: ["basic", "basic-plus"]},
        {group: "pro", label: "FlyLine Pro", label_mobile: "Pro", plans: ["pro", "pro-plus"]}
      ],
      selectedIndex: 0
    };
  },
  methods: {
    setSelectedIndex(i) {
      this.selectedIndex = i;
    }
  },
  computed: {
    ...Vuex.mapState(['plans']),
  }
});
