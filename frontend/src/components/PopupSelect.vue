<script>
import ClickOutside from "vue-click-outside";

export const PopupSelect = {
  data() {
    return {
      selectProgress: false
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
    }
  }
};

export default PopupSelect;
</script>
