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
      .then(data => {
        this.upcomingTrips = data.map(o=>{
          const innerData = o.data;
          delete o.data;
          const flights = o.flights;
          o.flights = o.flights.map(f=>{
            const innerData = f.data;
            delete f.data;
            return {...f, ...innerData};
          });
          return { ...o, ...innerData };
        });
      })
      .finally(() => (this.upcomingLoading = false));
    fetch("/api/bookings/?kind=past")
      .then(response => response.json())
      .then(data => (this.pastTrips = data))
      .finally(() => (this.pastLoading = false));
  }
});
