<template>
  <div class="overlay-component" :class="{ 'half-bottom': halfBottom }">
    <slot></slot>
    <router-link :to="link" class="button button--big button--outline"
      >{{ label }}</router-link
    >
  </div>
</template>

<script>
export default {
  props: ["link", "halfBottom", "label"]
};
</script>
