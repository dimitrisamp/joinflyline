<template>
  <div v-if="isVisible" class="search-overlay">
    <slot />
  </div>
</template>

<script>
export default {
  delimiters: ["{{", "}}"],
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  }
};
</script>
