export const Trips = Vue.component("trips", {
  data() {
    return {
      upcomingLoading: true,
      upcomingTrips: [],
      pastLoading: true,
      pastTrips: [],
      searchHistory: []
    };
  },
  template: "#vue-trips-template",
  delimiters: ["[[", "]]"],
  created() {
    fetch("/api/bookings/?kind=upcoming")
      .then(response => response.json())
      .then(data => (this.upcomingTrips = data))
      .finally(()=>this.upcomingLoading = false);
    fetch("/api/bookings/?kind=past")
      .then(response => response.json())
      .then(data => (this.pastTrips = data))
      .finally(()=>this.pastLoading = false);
  }
});
