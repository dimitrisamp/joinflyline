Vue.component('dynamic-select', {
  template: '#vue-dynamic-select-template',
  data() {
    return {
      options: {},
    }
  },
  props: ['value', 'discount'],
  delimiters: ['{(', ')}'],
  methods: {
    loadData() {
      fetch('/api/subscriptions/plan/').then(
          response => response.json()
      ).then(
          data => {
            this.options = data;
            this.$emit('data-arrived', Object.keys(data)[0]);
          }
      )
    },
  },
  created() {
    this.loadData();
  },
  computed: {
    items() {
      let result = {};
      for (let [name, value] of Object.entries(this.options)) {
        if (this.discount) {
          result[name] = `${value.name} ($${value.price.value * (100 - this.discount.percentage) / 100}/yr)`;
        } else {
          result[name] = `${value.name} ($${value.price.value}/yr)`;
        }
      }
      return result;
    }
  }
});
