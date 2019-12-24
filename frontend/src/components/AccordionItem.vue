<template>
  <div
    :id="groupId + '-item-' + item.id"
    class="accordion__item"
    :class="{ 'accordion__item--active': item.active }"
  >
    <div class="accordion__item-title">
      <a
        href="javascript:"
        @click="toggleHandler"
        class="accordion__item-button"
      >
        <h2 class="accordion__item-heading">{{ item.title }}</h2>
        <span class="accordion__item-icon">
          <svg
            width="27px"
            height="15px"
            viewBox="0 0 27 15"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            >
            <g
              id="Page-1"
              stroke="none"
              stroke-width="1"
              fill="none"
              fill-rule="evenodd"
            >
              >
              <image
                id="back-(4)"
                transform="translate(13.500000, 7.500000) rotate(270.000000) translate(-13.500000, -7.500000) "
                x="0"
                y="-6"
                width="27"
                height="27"
                xlink:href="data:image/png;base64,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"
              />
            </g>
          </svg>
        </span>
      </a>
    </div>
    <transition
      name="accordion-item"
      @enter="transitionStart"
      @after-enter="transitionEnd"
      @before-leave="transitionStart"
      @after-leave="transitionEnd"
    >
      <div v-if="item.active" class="accordion__item-content">
        <div class="accordion__item-inner">
          <div v-html="item.details"></div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  delimiters: ["{{", "}}"],
  props: {
    item: {
      required: true
    },
    groupId: {
      required: true
    }
  },
  methods: {
    toggleHandler(event) {
      this.$parent.$children.forEach(item => {
        if (
          item.$el.id === event.currentTarget.parentElement.parentElement.id
        ) {
          item.item.active = !item.item.active;
        } else {
          item.item.active = false;
        }
      });
    },
    transitionStart(el) {
      el.style.height = el.scrollHeight + "px";
    },
    transitionEnd(el) {
      el.style.height = "";
    }
  }
};
</script>
