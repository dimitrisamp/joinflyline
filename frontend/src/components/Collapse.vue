<template>
  <div class="filter-sidebar__item">
    <h3
      class="filter-sidebar__item-title"
      :class="{ collapsed: isCollapsed }"
      @click="toggleCollapse"
    >
      {{ title }}
    </h3>
    <slot v-if="!isCollapsed" />
  </div>
</template>

<script>
export default {
  delimiters: ["{{", "}}"],
  props: {
    title: {
      type: String
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
    };
  },
  methods: {
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    }
  }
};
</script>
