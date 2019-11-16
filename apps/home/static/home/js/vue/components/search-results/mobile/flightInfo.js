import {airlineIcon, secs2hm, seatTypes} from "../../../../utils.js";


Vue.component('flight-info-mobile', {
    template: '#vue-flight-info-mobile-template',
    props: ['duration', 'airlines', 'stopOvers', 'seat_type'],
    delimiters: ['{(', ')}'],
    methods: {
        airlineIcon,
        secs2hm,
    },
    computed: {
        stopOversText() {
            if (this.stopOvers === 0) return 'Direct';
            if (this.stopOvers === 1) return '1 Stopover';
            return `${this.stopOvers} Stopovers`;
        },
        seatTypeText() {
            return seatTypes[this.seat_type];
        }
    }
});
