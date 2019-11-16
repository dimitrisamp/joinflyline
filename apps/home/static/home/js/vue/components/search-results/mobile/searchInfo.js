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
    props: ['form', 'sortResultsBy', 'cityToInput', 'cityFromInput'],
    methods: {
        backPressed() {
            this.$emit('back-pressed');
        }
    },
    delimiters: ['{(', ')}'],
    computed: {
        cityFrom() {
            const ci = this.cityFromInput;
            return ci.searchResults[ci.selectedIndex].code;
        },
        cityTo() {
            const ci = this.cityToInput;
            return ci.searchResults[ci.selectedIndex].code;
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
