import api from "../http.js";

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
  methods: {
    processTrips(data) {
      return data.map(o => {
        const innerData = o.data;
        delete o.data;
        const flights = o.flights;
        o.flights = o.flights.map(f => {
          const innerData = f.data;
          delete f.data;
          return { ...f, ...innerData };
        });
        return { ...o, ...innerData };
      });
    }
  },
  created() {
    api
      .get("/bookings/?kind=upcoming")
      .then(response => {
        this.upcomingTrips = this.processTrips(response.data);
      })
      .finally(() => (this.upcomingLoading = false));
    api
      .get("/bookings/?kind=past")
      .then(response => {
        this.pastTrips = this.processTrips(response.data);
      })
      .finally(() => (this.pastLoading = false));
  }
});
