export const CheckoutForm = Vue.component('checkout-form', {
    props: ['form', 'total_price', 'bookingProgress', 'canBook'],
    template: '#vue-checkout-form-template',
    methods: {
        book() {

            this.$emit('book');
        },
    },
    delimiters: ['[[', ']]'],
    computed: {
        bookDisabled() {
            return !(canBook);
        }
    }
});
