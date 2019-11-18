import {formatDate} from "../../../../utils.js";

Vue.component('search-info-mobile', {
    template: '#vue-search-info-mobile-template',
    data() {
        return {
            sortOptions: {
                quality: 'Best',
                price: 'Cheapest',
                duration: 'Quickest'
            }
        }
    },
    props: ['form', 'sortResultsBy', 'placeTo', 'placeFrom'],
    methods: {
        backPressed() {
            this.$emit('back-pressed');
        }
    },
    delimiters: ['{(', ')}'],
    computed: {
        cityFrom() {
            return this.placeFrom.code;
        },
        cityTo() {
            return this.placeTo.code;
        },
        roundTrip() {
            return this.form.destinationTypeId === 'round';
        },
        dateFrom() {
            return formatDate(this.form.departure_date_data);
        },
        dateTo() {
            return formatDate(this.form.return_date_data);
        },
    }
});
