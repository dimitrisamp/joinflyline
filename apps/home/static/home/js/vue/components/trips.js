export const Trips = Vue.component("trips", {
  data() {
    return {
      upcoming_trips: [],
      past_trips: [],
      search_history: []
    };
  },
  template: "#vue-trips-template",
  delimiters: ["[[", "]]"],
  created() {
    fetch("/api/bookings/?kind=upcoming")
      .then(response => response.json())
      .then(data => (this.upcoming_trips = data));
    fetch("/api/bookings/?kind=past")
      .then(response => response.json())
      .then(data => (this.past_trips = data));
  }
});
