<script>
import Lightpick from "lightpick";
import Vuex from "vuex";

export const SearchForm = {
  delimiters: ["{{", "}}"],
  data() {
    return {
      backToForm: false,
      fullPageApplied: false
    };
  },
  picker: null,
  watch: {
    "form.destinationTypeId": {
      handler() {
        if (this.$options.picker) this.$options.picker.destroy();
        this.setDatePick();
      }
    }
  },
  methods: {
    switchToForm() {
      this.backToForm = true;
    },
    setDatePick() {
      const that = this;
      this.$options.picker = new Lightpick({
        field: document.getElementById("departure_date"),
        secondField:
          this.form.destinationTypeId === "round"
            ? document.getElementById("return_date")
            : null,
        singleDate: this.form.destinationTypeId !== "round",
        onSelect(start, end) {
          that.setDates({ start, end });
        }
      });
    },
    ...Vuex.mapActions("search", ["search", "loadMore", "sortResultsBy"]),
    ...Vuex.mapMutations("search", [
      "updatePlaceFrom",
      "updatePlaceTo",
      "setSeatType",
      "setDates",
      "setDestinationType"
    ])
  },
  mounted() {
    this.setDatePick();
  },
  computed: {
    ...Vuex.mapState("user", ["user"]),
    ...Vuex.mapState("search", ["searchResults", "form", "searchProgress"]),
    ...Vuex.mapGetters("search", ["cityFromTo", "airlineNames"]),
    isFormIncomplete() {
      if (this.form.destinationTypeId === "round") {
        if (!this.form.return_date) return true;
      }
      if (!this.form.departure_date) return true;
      return this.placeFrom === null || !this.placeTo === null;
    },
    showWideForm() {
      return (
        this.user.anonymous &&
        this.searchResults.length === 0 &&
        !this.searchProgress
      );
    },
    isMobile() {
      return this.$mq === "sm";
    }
  }
};

export default SearchForm;
</script>
