export const NavBar = Vue.component("nav-bar", {
  template: "#vue-nav-bar-template",
  delimiters: ["{(", ")}"],
  computed: Vuex.mapState({
    user: "user"
  })
});
