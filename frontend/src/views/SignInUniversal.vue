<template>
  <sign-in v-if="$mq === 'sm'" />
  <wizard-log-in v-else />
</template>

<script>
import SignIn from "./SignIn";
import WizardLogIn from "../components/WizardLogIn";

export default {
  name: "SignInUniversal",
  components: {
    SignIn,
    WizardLogIn
  }
};
</script>

<style scoped></style>
