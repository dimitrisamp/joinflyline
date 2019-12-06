import {
    airlineIcon,
    formatDate,
    formatTime,
    getRetailUrl,
    getSpecificRoute,
    secs2hm,
    staticUrl,
    timeInterval,
} from '../../utils.js';

Vue.component('flight', {
    template: '#vue-flight-template',
    props: ['flight', 'form', 'user',],
    delimiters: ['{(', ')}'],
    data() {
        return {
            collapsed: true,
        }
    },
    methods: {
        formatPassengerCountByCategory() {
            const {valAdults, valChildren, valInfants} = this.form;
            const adultsText = valAdults === 0 ? '' : `${valAdults} Adult${valAdults > 1 ? 's' : ''}`;
            const childrenText = valChildren === 0 ? '' : `${valChildren} Child${valChildren > 1 ? 'ren' : ''}`;
            const infantsText = valInfants === 0 ? '' : `${valInfants} Infant${valInfants > 1 ? 's' : ''}`;
            return [adultsText, childrenText, infantsText].filter((v) => v.length > 0).join(', ');
        },
        bookFlight(index) {
            if (this.user.anonymous) {
                this.$emit('showPopup');
            } else {
                this.$emit('proceed-to-booking');
            }
        },
        toggleCollapsed() {
            this.collapsed = !this.collapsed;
        },
        airlineIcon,
        formatDate,
        formatTime,
        getRetailUrl,
        getSpecificRoute,
        secs2hm,
        staticUrl,
        timeInterval
    },
    computed: {
        interlining() {
            return new Set(this.flight.route.map(o=>o.airline)).size > 1;
        },
    }
});
