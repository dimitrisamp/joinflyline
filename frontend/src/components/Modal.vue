<template>
  <transition name="modal">
    <div class="modal__mask" @click="$emit('click-outside')">
      <div class="modal__wrapper">
        <div class="modal__container" @click.stop>
          <div class="modal__body">
            <slot name="body" />
          </div>

          <!-- Close Modal -->
          <button
            v-if="showCloseButton"
            class="modal__button"
            @click="$emit('close')"
          />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Modal",
  props: ["showCloseButton"]
};
</script>
