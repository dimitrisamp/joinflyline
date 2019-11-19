export const SearchForm = {
  delimiters: ["{(", ")}"],
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
      new Lightpick({
        field: document.getElementById("departure_date"),
        secondField: document.getElementById("return_date"),
        singleDate: false,
        onSelect(start, end) {
          that.setDates({start, end});
        }
      });
    },
    ...Vuex.mapActions(['search']),
    ...Vuex.mapMutations([
      "updatePlaceFrom",
      "updatePlaceTo",
      "setSeatType",
      "setDates",
      "setDestinationType",
    ]),
  },
  mounted() {
    this.setDatePick();
  },
  computed: {
    ...Vuex.mapState(["user", "searchResults", "form", "searchProgress"]),
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
    cityFromTo() {
      return `${this.form.placeFrom.name} -> ${this.form.placeTo.name}`;
    },
    isMobile() {
      return this.$mq === "sm";
    },
    airlineNames() {
      const airlines = this.form.airlines.map(o=>o.name);
      const others = airlines.length - 3;
      const airlinesText = airlines.slice(0, 3).join(', ');
      if (others > 0) {
        return `${airlinesText} and ${others} more`;
      }
      return airlinesText;
    }
  }
};
