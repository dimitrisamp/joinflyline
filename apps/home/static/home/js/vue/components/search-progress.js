export const SearchProgress = Vue.component("search-progress", {
  delimiters: ["[[", "]]"],
  render(h) {
    if (this.isVisible) {
      return h(
        "div",
        {
          class: {
            "search-overlay": true
          }
        },
        this.$slots.default
      );
    }
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  }
});
