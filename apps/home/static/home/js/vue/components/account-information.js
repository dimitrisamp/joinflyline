export const AccountInformation = Vue.component("account-information", {
  template: "#vue-account-information-template",
  data() {
    return {
      account_ready: false,
      profile_ready: false,
      frequent_flyer_ready: false,
      deals_ready: false
    };
  },
  delimiters: ["[[", "]]"],
  created() {
    fetch();
    fetch();
  }
});
