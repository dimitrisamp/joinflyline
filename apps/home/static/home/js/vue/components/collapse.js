export const Collapse = Vue.component('collapse', {
    template: '#vue-collapse-template',
    delimiters: ['[[', ']]'],
    props: {
        title: {
          type: String,
        },
        collapsed: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    data() {
      return {
          isCollapsed: this.collapsed
      }
    },
    methods: {
        toggleCollapse() {
            this.isCollapsed = !this.isCollapsed;
        }
    }
});
