export const SavingsExplained = Vue.component('savings-explained', {
    template: '#vue-savings-explained-template',
    delimiters: ['{(', ')}'],
    computed: Vuex.mapState({
        user: 'user',
    })
});
