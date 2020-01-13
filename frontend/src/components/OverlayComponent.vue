<template>
  <div class="overlay-component" :class="{ 'half-bottom': halfBottom }">
    <slot></slot>
    <div class="overlay-compnent__footer">
      <router-link :to="link" class="button button--big button--outline">{{
        label
      }}</router-link>
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
export default {
  props: ["link", "halfBottom", "label"]
};
</script>
