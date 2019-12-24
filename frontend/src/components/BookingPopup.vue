<template>
  <modal show-close-button="false">
    <template slot="body">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ title }}
          </h5>
        </div>
        <div class="modal-body">
          <h1>{{ body }}</h1>
        </div>
        <div class="modal-footer">
          <button
            @click="onButtonClick"
            type="button"
            class="btn btn-secondary"
            data-dismiss="modal"
          >
            {{ buttonLabel }}
          </button>
        </div>
      </div>
    </template>
  </modal>
</template>

<script>
export default {
  props: ["title", "body", "buttonLabel"],
  name: "BookingPopup",
  methods: {
    onButtonClick() {
      this.$emit("button-click");
    }
  }
};
</script>
