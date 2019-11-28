export const Tab = Vue.component('tab', {
    template: '#vue-tab-template',
    delimiters: ['[[', ']]'],
    props: {
        title: {
          required: true
        },
        selected: {
          default: false
        }
    },
    data() {
      return {
        isActive: false
      }
    },
    mounted() {
      this.isActive = this.selected
    }
});
