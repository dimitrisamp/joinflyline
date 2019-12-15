export const NavBar = Vue.component("nav-bar", {
  template: "#vue-nav-bar-template",
  delimiters: ["{(", ")}"],
  methods: {
    ...Vuex.mapState('user', ["logOut"])
  },
  computed: {
    ...Vuex.mapState('user', ["user"]),
    isMobile() {
      return this.$mq === "sm";
    }
  }
});
