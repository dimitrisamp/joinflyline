export const CheckoutForm = Vue.component('checkout-form', {
    props: ['form', 'total_price', 'bookingProgress'],
    template: '#vue-checkout-form-template',
    methods: {
        book() {
            this.$emit('book');
        }
    },
    delimiters: ['[[', ']]'],
});
