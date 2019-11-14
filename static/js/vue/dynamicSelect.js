Vue.component('dynamic-select', {
    template: '#vue-dynamic-select-template',
    data() {
        return {
            options: {},
        }
    },
    props: ['value'],
    delimiters: ['{(', ')}'],
    methods: {
        loadData() {
            fetch('/subscriptions/plan/').then(
                response=>response.json()
            ).then(
                data=>{
                    let result = {};
                    for (let [name, value] of Object.entries(data)) {
                        result[name] = `${value.name} ($${value.price.value}/yr)`;
                    }
                    this.options = result;
                    this.$emit('data-arrived', Object.keys(data)[0]);
                }
            )
        },
    },
    created() {
        this.loadData();
    }
});
