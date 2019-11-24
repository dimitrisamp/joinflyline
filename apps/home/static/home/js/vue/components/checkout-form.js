export const CheckoutForm = Vue.component('checkout-form', {
    props: ['form', 'total_price'],
    template: '#vue-checkout-form-template',
    delimiters: ['[[', ']]'],
});
