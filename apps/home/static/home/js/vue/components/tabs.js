export const Tabs = Vue.component('tabs', {
    template: '#vue-tabs-template',
    delimiters: ['[[', ']]'],
    props: {
      tabsWrapperClass: {
      type: String,
      default: ""
      },

      tabsContentClass: {
      type: String,
      default: "tabs__content"
    }
  },
  data() {
    return {
      tabs: []
    };
  },
  created() {
    this.tabs = this.$children;
  },
  methods: {
    selectTab(selectedTab) {
      this.tabs.forEach(tab => tab.isActive = tab.title === selectedTab.title);
    }
  }
});
