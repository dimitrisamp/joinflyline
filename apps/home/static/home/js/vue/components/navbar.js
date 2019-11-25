export const NavBar = Vue.component("nav-bar", {
  template: "#vue-nav-bar-template",
  delimiters: ["{(", ")}"],
  methods: {
    ...Vuex.mapState(['logOut']),
  },
  computed: Vuex.mapState({
    user: "user"
  })
});
