import { airlineIcon } from "../../utils.js";
import { airlinePhones } from "../../airlinePhones.js";
import { airlineCodes } from "../../airlineCodes.js";

export const Airlines = Vue.component("airlines", {
  template: "#vue-airlines-template",
  data() {
    return {
      airlineCodes,
      airlinePhones,
      airlineIcon
    };
  },
  delimiters: ["[[", "]]"]
});
