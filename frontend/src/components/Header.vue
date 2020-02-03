<template>
  <header class="header">
    <nav-bar />
  </header>
</template>

<script>
import NavBar from "./NavBar";

export default {
  components: {
    NavBar
  },
  mounted() {
    document.body.classList.add("has-fixed-nav");
  }
};
</script>

<style>
body.has-fixed-nav {
  padding-top: 72px;
}
</style>
