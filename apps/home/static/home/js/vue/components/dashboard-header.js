export const DashboardHeader = Vue.component('dashboard-header', {
    template: '#vue-dashboard-header-template',
    delimiters: ['[[', ']]'],
    computed: {
        toggleSidebar() {
            return this.$store.getters.toggleSidebar;
        }
    }
});
