import { getCookie } from "./utils.js";

Vue.component("wizard", {
  template: "#vue-wizard-template",
  data() {
    return {
      step: 1,
      emailExists: false,
      emailVerified: false,
      form: {
        home_airport: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        promo_code: "",
        zip: "",
        card_number: "",
        expiry: "",
        cvc: ""
      }
    };
  },
  delimiters: ["{(", ")}"],
  methods: {
    nextStep() {
      if (this.emailVerified) {
        this.step = 2;
        return;
      }
      let that = this;
      this.verifyEmail(()=>{
        if (that.emailVerified) {
          that.step = 2;
        }
      });
    },
    verifyEmail(callback) {
      let url = new URL('/auth/check-user/', window.location.href);
      let searchParams = {
          email: this.form.email
      };
      url.search = new URLSearchParams(searchParams);
      fetch(url)
        .then(response => response.json())
        .then(data => {
          this.emailExists = data.exists;
          this.emailVerified = true;
          if (callback) callback();
        });
    },
    onEmailChange() {
      this.emailVerified = false;
      this.verifyEmail();
    },
    submit() {
      let formData = new FormData();
      formData.append("csrfmiddlewaretoken", csrfmiddlewaretoken);
      for (let k in this.form) {
        if (this.form[k]) {
          formData.append(k, this.form[k]);
        }
      }
      fetch(getStartedUrl, {
        method: "POST",
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            this.$emit("success");
          } else {
            window.alert(JSON.stringify(data));
          }
        });
    }
  },
  computed: {
    isStep1Complete() {
      return (
        this.form.home_airport !== "" &&
        this.form.email !== "" &&
        this.form.password !== "" &&
        !this.emailExists
      );
    },
    isStep2Complete() {
      return this.form.first_name !== "" && this.form.last_name !== "";
    }
  }
});

const wizardApp = new Vue({
  el: "#main",
  delimiters: ["{(", ")}"],
  methods: {
    goHome() {
      window.location = "/";
    }
  }
});
