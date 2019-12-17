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
  methods: {
    switchToForm() {
      this.backToForm = true;
    },
    setDatePick() {
      let that = this;
      setTimeout(() => {
        new Lightpick({
          field: document.getElementById("departure_date"),
          secondField: document.getElementById("return_date"),
          singleDate: false,
          onSelect(start, end) {
            that.setDates({ start, end });
          }
        });
      }, 500);
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
