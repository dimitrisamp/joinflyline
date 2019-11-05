import { getCookie } from "./utils.js";

Vue.component("wizard", {
  template: "#vue-wizard-template",
  data() {
    return {
      step: 1,
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
      this.step = 2;
    },
    submit() {
      let formData = new FormData();
      formData.append("csrfmiddlewaretoken", csrfmiddlewaretoken);
      for (let k in this.form) {
        if (this.form[k]) {
          formData.append(k, this.form[k]);
        }
      }
      fetch("/wizard/", {
        method: "POST",
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            this.$emit('success');
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
        this.form.password !== ""
      );
    },
    isStep2Complete() {
      return (
        this.form.first_name !== "" &&
        this.form.last_name !== ""
      );
    }
  }
});

const wizardApp = new Vue({
  el: "#main",
  delimiters: ['{(', ')}'],
  methods: {
    goHome() {
      window.location = '/';
    }
  }
});
