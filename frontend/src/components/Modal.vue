<template>
  <transition name="modal">
    <div class="modal__mask" @click="$emit('click-outside')">
      <div class="modal__wrapper">
        <div class="modal__container" @click.stop>
          <div class="modal__body">
            <slot name="body"></slot>
          </div>

          <!-- Close Modal -->
          <button class="modal__button" @click="$emit('close')"></button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Modal"
};
</script>

<style scoped></style>
