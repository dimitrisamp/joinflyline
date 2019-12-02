export const AccordionItem = Vue.component('accordion-item', {
  template: '#vue-accordion-item-template',
  delimiters: ['[[', ']]'],
  props: {
   item: {
     required: true
   },
    groupId: {
     required: true
    }
  },
  methods: {
    toggleHandler(event) {
      this.$parent.$children.forEach(item => {
        if (item.$el.id === event.currentTarget.parentElement.parentElement.id) {
          item.item.active = !item.item.active
        } else {
          item.item.active = false
        }
      });
    },
    transitionStart(el) {
      el.style.height = el.scrollHeight + 'px'
    },
    transitionEnd(el) {
      el.style.height = ''
    }
  }
});
