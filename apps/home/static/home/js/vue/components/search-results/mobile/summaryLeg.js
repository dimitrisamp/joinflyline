import {secs2hm, formatTime, formatDate} from "../../../../utils.js";

Vue.component('summary-leg-mobile', {
    template: '#vue-summary-leg-mobile-template',
    props: ['flights'],
    delimiters: ['{(', ')}'],
    computed: {
        legTo() {
            const flight = this.flights[this.flights.length - 1];
            return {
                city: flight.cityTo,
                time: formatTime(new Date(flight.local_arrival)),
                code: flight.flyTo,
            };
        },
        legFrom() {
            const flight = this.flights[0];
            return {
                city: flight.cityFrom,
                time: formatTime(new Date(flight.local_departure)),
                code: flight.flyTo,
            };
        },
        flightInfo() {
            const start = new Date(this.flights[0].utc_departure);
            const end = new Date(this.flights[this.flights.length - 1].utc_arrival);
            return {
                duration: secs2hm((end - start) / 1000),
                airlines: this.flights.map(o=>o.airline),
                stopOvers: this.flights.length - 1,
                seat_type: [...new Set(this.flights.map(o=>o.fare_category))],
            }
        },
        date() {
            return formatDate(new Date(this.flights[0].local_departure));
        }
    }
});
