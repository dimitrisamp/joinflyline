<template>
  <WizardGetStarted v-if="$mq !== 'sm'" />
  <Wizard v-else />
</template>

<script>
import Wizard from "./Wizard";
import WizardGetStarted from "../components/WizardGetStarted";

export default {
  name: "WizardUniversal",
  components: {
    Wizard,
    WizardGetStarted
  }
};
</script>

<style scoped></style>
