export const Sidebar = {
    template: '#vue-sidebar-template',
    delimiters: ['[[', ']]'],
    name: 'sidebar',
    watch: {
        '$route' () {
            this.$store.dispatch('toggleSidebar')
        }
    },
    computed: {
        toggleSidebar() {
            return this.$store.getters.toggleSidebar;
        }
    }
};
