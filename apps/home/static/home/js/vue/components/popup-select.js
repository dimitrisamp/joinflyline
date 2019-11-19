import ClickOutside from "../../v-click-outside.js";

export const PopupSelect = {
  data() {
    return {
      selectProgress: false,
    };
  },
  directives: {
    ClickOutside
  },
  methods: {
    open() {
      setTimeout(() => {
        this.selectProgress = true;
      }, 150);
    },
    close() {
      this.selectProgress = false;
    },
  }
};
