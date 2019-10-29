import {
    airlineIcon,
    formatDate,
    formatTime,
    getRetailUrl,
    getSpecificRoute,
    secs2hm,
    staticUrl,
    timeInterval
} from './utils.js';



Vue.component('flight', {
    template: '#vue-flight-template',
    props: ['flight', 'form'],
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
    }
});
