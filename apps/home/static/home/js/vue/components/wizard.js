import api from "../http.js";
import {debounce} from "../../utils.js";

const getStartedCompanionUrl = "/api/get-started-companion/";
const getStartedUrl = "/api/get-started/";

export const Wizard = Vue.component("wizard", {
  template: "#vue-wizard-template",
  metaInfo: {
    title: "Get Started | FlyLine"
  },
  data() {
    return {
      step: 1,
      emailExists: false,
      emailVerified: false,
      requestSent: false,
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
        cvc: "",
        plan: null,
        code: this.$route.query.code
      },
      inviteMode: this.$route.query.hasOwnProperty("code"),
      invite: null,
      inviteCodeCheckProgress: false,
      inviteCodeRejected: false,
      discount: null,
      promoCheckProgress: false,
      promoInvalid: false,
    };
  },
  created() {
    if (this.inviteMode) {
      this.checkInvite();
    }
  },
  delimiters: ["{(", ")}"],
  watch: {
    step: function (val, oldVal) {
      Vue.nextTick().then(() => {
        if (val === 2) this.focusElement("first_name");
      });
    }
  },
  methods: {
    ...Vuex.mapActions('user', ["authenticate"]),
    prevStep() {
      this.step = 1;
    },
    nextStep() {
      if (this.emailVerified && this.isStep1Complete) {
        this.step = 2;
        return;
      }
      let that = this;
      this.verifyEmail(() => {
        if (that.emailVerified) {
          that.step = 2;
        }
      });
    },
    checkPromo: debounce(function () {
      if (this.promoCheckProgress) setTimeout(this.checkPromo, 500);
      const promo = this.form.promo_code;
      if (promo.length === 0) {
        this.promoInvalid = false;
        return;
      }
      this.promoCheckProgress = true;
      api
          .get("subscriptions/check-promo", {params: {promocode: promo}})
          .then(response => {
            this.discount = response.data.discount;
            this.promoInvalid = false;
          })
          .catch(e => {
            this.promoInvalid = true;
          })
          .finally(() => {
            this.promoCheckProgress = false;
          });
    }, 500),
    checkInvite() {
      this.inviteCodeCheckProgress = true;
      api
          .get("check-invite/", {params: {code: this.form.code}})
          .then(response => {
            this.invite = response.data;
            this.form.email = response.data.email;
          })
          .catch(e => {
            this.inviteCodeRejected = true;
          })
          .finally(() => {
            this.inviteCodeCheckProgress = false;
          });
    },
    verifyEmail(callback) {
      if (this.emailInvalid) return;
      let url = new URL("/api/auth/check-user/", window.location.href);
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
    focusElement(name) {
      const el = document.querySelector(`[name=${name}]`);
      el.focus();
      el.select();
    },
    updateSelectValue(value) {
      this.form.plan = this.$route.params.plan || value;
    },
    updatePlaceFrom(value) {
      this.form.home_airport = value;
    },
    submit() {
      if (!this.isStep2Complete) return;
      this.requestSent = true;
      Vue.nextTick().then(() => {
        let formData = new FormData();
        formData.append("csrfmiddlewaretoken", csrfmiddlewaretoken);
        for (let k in this.form) {
          if (this.form[k]) {
            if (k === "home_airport") {
              formData.append(k, JSON.stringify(this.form[k]));
            } else if (k === "promo_code") {
              if (this.form[k].length !== 0 && !this.promoInvalid) {
                formData.append(k, this.form[k]);
              }
            } else {
              formData.append(k, this.form[k]);
            }
          }
        }
        fetch(this.inviteMode ? getStartedCompanionUrl : getStartedUrl, {
          method: "POST",
          body: formData
        })
            .then(response => response.json())
            .then(data => {
              if (data.success) {
                this.authenticate({
                  email: this.form.email,
                  password: this.form.password,
                  router: this.$router,
                  name: "account"
                });
              } else {
                window.alert(JSON.stringify(data));
              }
            });
      });
    }
  },
  computed: {
    emailInvalid() {
      return this.form.email.length > 0 && !this.form.email.includes("@");
    },
    displayForm() {
      if (!this.inviteMode) return true;
      if (this.inviteCodeCheckProgress) return false;
      if (this.invite) return true;
    },
    isStep1Complete() {
      return (
          this.form.home_airport !== "" &&
          this.form.email !== "" &&
          this.form.password !== "" &&
          !this.emailExists
      );
    },
    isStep2Complete() {
      if (this.inviteMode) {
        return this.form.first_name !== "" && this.form.last_name !== "";
      }
      return (
          this.form.first_name !== "" &&
          this.form.last_name !== "" &&
          this.form.card_number !== "" &&
          this.form.expiry !== "" &&
          this.form.cvc !== "" &&
          !this.promoCheckProgress
      );
    }
  }
});
