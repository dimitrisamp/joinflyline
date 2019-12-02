export const Accordion = Vue.component('accordion', {
    template: '#vue-accordion-template',
    delimiters: ['[[', ']]'],
    props: {
      content: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        groupId: null
      }
    },
    mounted() {
      this.groupId = this.$el.id;
    }
});
