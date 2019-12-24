<template>
  <div class="tabs" :class="tabsWrapperClass">
    <ul class="tabs__list">
      <li
        class="tabs__item"
        v-for="tab in tabs"
        :key="tab.title.toLowerCase().replace(/ /g, '-')"
        :class="{ 'is-active': tab.isActive }"
        @click="selectTab(tab)"
      >
        <a href="javascript:" class="tabs__link">{{ tab.title }}</a>
      </li>
    </ul>
    <div :class="tabsContentClass">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  delimiters: ["{{", "}}"],
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
      this.tabs.forEach(
        tab => (tab.isActive = tab.title === selectedTab.title)
      );
    }
  }
};
</script>
