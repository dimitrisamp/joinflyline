<template>
  <div class="overlay-component">
    <slot></slot>
    <router-link :to="link" class="button button--big button--outline"
      >Get Started</router-link
    >
  </div>
</template>

<script>
export default {
  props: ["link"]
};
</script>
