export const SavingsExplained = Vue.component('flight', {
    template: '#vue-savings-explained-template',
    delimiters: ['{(', ')}'],
    computed: Vuex.mapState({
        user: 'user',
    })
});
