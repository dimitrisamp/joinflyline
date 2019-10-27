const AIRLINE_ICONS = {
    "DL": "delta",
    "AS": "alaska",
    "NK": "spirit",
    "B6": "jetblue",
    "F9": "frontier",
    "G4": "allegiant",
    "UA": "united",
    "AA": "american",
    "WN": "southwest",
    "SY": "suncountry",
};

Vue.component('flight', {
    template: '#vue-flight-template',
    props: ['flight', 'form'],
    delimiters: ['{(', ')}'],
    data() {
        return {
            collapsed: false,
        }
    },
    methods: {
        formatPassengerCountByCategory() {
            const {valAdults, valChildren, valInfants} = this.form;
            const adultsText = valAdults===0?'':`${valAdults} Adult${valAdults > 1?'s':''}`;
            const childrenText = valChildren===0?'':`${valChildren} Child${valChildren > 1?'ren':''}`;
            const infantsText = valInfants===0?'':`${valInfants} Infant${valInfants > 1?'s':''}`;
            return [adultsText, childrenText, infantsText].filter((v)=>v.length > 0).join(', ');
        },
        secs2hm(value) {
            const total_minutes = Math.floor(value / 60);
            const minutes = total_minutes % 60;
            const total_hours = Math.floor(total_minutes / 60);
            const hours = total_hours % 24;
            const days = Math.floor(total_hours / 24);
            const days_part = days?`${days}d `:'';
            const hours_part = hours?`${hours}h `:'';
            return `${days_part}${hours_part}${minutes}m`;
        },
        formatDate(value) {
            return moment(value).format("D MMM");
        },
        timeInterval(route) {
            const utc_departure = new Date(route.utc_departure);
            const utc_arrival = new Date(route.utc_arrival);
            const diff = utc_arrival.getTime() - utc_departure.getTime();
            return this.secs2hm(diff / 1000);
        },
        static(path) {
            return `/static/${path}`;
        },
        airlineIcon(name) {
            return `/static/images/${AIRLINE_ICONS[name]}.png`;
        },
        formatTime(value) {
            return moment(value).format("hh:mm A");
        },
        getSpecificRoute(routes, _return, last) {
            const subroutes = routes.filter((r)=>r.return === _return?1:0);
            if (subroutes) {
                if (last) {
                    return subroutes[subroutes.length - 1];
                } else {
                    return subroutes[0];
                }
            }
        },
        getRetailUrl() {
            return 'hello';
        },
        toggleCollapsed() {
            this.collapsed = !this.collapsed;
        }
    }
});
