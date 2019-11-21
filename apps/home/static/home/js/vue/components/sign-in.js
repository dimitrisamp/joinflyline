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
      hasError: false,
      errorText: ""
    };
  },
  methods: {
    handleSubmit(event) {
      const ctx = this;

      if (this.email && this.password) {
        axios.post("/api/auth/login/", {}, {
          headers: {
            "Authorization": "Basic " + btoa(`${this.email}:${this.password}`)
          }
        })
          .then(response => {
            if (response.status < 400) {
              localStorage.setItem('authToken', response.data.token);
              ctx.$store.dispatch("initialize").then(() => {
                this.$router.push({ name: "dashboard" });
              });
            } else if (response.status === 401) {
              ctx.errorText = "Failed to login";
            } else {
              ctx.errorText = "Something went wrong";
            }
            return response.json()
          })
          .catch(error => {
            ctx.errorText = "Something went wrong";
          });
      } else {
        this.hasError = true;
      }
    }
  }
});
