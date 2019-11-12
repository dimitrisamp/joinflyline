Vue.component('airport-info-mobile', {
    template: '#vue-airport-info-mobile-template',
    props: ['time', 'city', 'code'],
    delimiters: ['{(', ')}'],
    computed: {
        timeFormatted() {
            return this.time.toLocaleDateString();
        }
    }
});
