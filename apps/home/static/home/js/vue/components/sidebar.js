export const Sidebar = {
    template: '#vue-sidebar-template',
    delimiters: ['[[', ']]'],
    name: 'sidebar',
    methods: {
        ...Vuex.mapActions(['logOut']),
        handleSidebarLinkClick() {
            this.$store.dispatch('toggleSidebar')
        }
    },
    computed: {
        toggleSidebar() {
            return this.$store.getters.toggleSidebar;
        },
        userNameSurname() {
            if (this.user) {
                return `${this.user.first_name || ''} ${this.user.last_name || ''}`
            }
            return 'No user'
        },
        userPlan() {
            if (this.user && this.user.subscriptions) {
                const p = this.plans[this.user.subscriptions.plan];
                if (p) return `${p.name} - $${p.price.value}/yr`;
                return '';
            }
        },
        ...Vuex.mapState(['user', 'plans']),
    },
};
