<template>
  <div class="tile">
    <template v-if="multiTitle">
      <div class="tile__heading-container">
        <h3 class="tile__heading">
          <span v-text="title" />
          <span class="tile__heading-right" v-text="titleRight" />
        </h3>
      </div>
    </template>
    <h3 v-else class="tile__heading" v-text="title" />
    <div class="tile__body">
      <slot />
      <p class="tile__body-no-result" v-if="empty">
        <slot name="empty" />
      </p>
    </div>
  </div>
</template>

<script>
export default {
  delimiters: ["{{", "}}"],
  props: {
    title: String,
    titleRight: String,
    multiTitle: Boolean,
    empty: Boolean
  }
};
</script>
