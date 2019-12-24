<template>
  <div>
    <h3>{{ time }} {{ city }}</h3>
    <span>{{ code }}</span>
  </div>
</template>

<script>
export default {
  props: ["time", "city", "code"],
  delimiters: ["{{", "}}"],
  computed: {
    timeFormatted() {
      return this.time.toLocaleDateString();
    }
  }
};
</script>
