<template>
  <transition name="slide-up" mode="out-in">
    <div v-show="isActive">
      <slot />
    </div>
  </transition>
</template>

<script>
export default {
  delimiters: ["{{", "}}"],
  props: {
    title: {
      required: true
    },
    selected: {
      default: false
    }
  },
  data() {
    return {
      isActive: false
    };
  },
  mounted() {
    this.isActive = this.selected;
  }
};
</script>
