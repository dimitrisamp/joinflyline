export const SignIn = Vue.component("SignInFormComponent", {
  template: "#vue-sign-in-form-template",
  delimiters: ["[[", "]]"],
  metaInfo: {
    title: "Log In | FlyLine"
  },
  data() {
    return {
      email: "",
      password: "",
      hasError: false
    };
  },
  methods: {
    ...Vuex.mapActions(["authenticate"]),
    handleSubmit(event) {
      const ctx = this;
      if (this.email && this.password) {
        this.authenticate({
          email: this.email,
          password: this.password,
          router: this.$router,
          name: 'overview',
        });
      } else {
        this.hasError = true;
      }
    }
  },
  computed: {
    ...Vuex.mapState(["authErrorText"])
  }
});
