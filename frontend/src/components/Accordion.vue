<template>
  <div class="accordion">
    <accordion-item
      v-for="item in content"
      :item="item"
      :groupId="groupId"
      :key="item.id"
    >
    </accordion-item>
  </div>
</template>

<script>
import AccordionItem from "./AccordionItem";

export default {
  delimiters: ["{{", "}}"],
  components: {
    "accordion-item": AccordionItem
  },
  props: {
    content: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      groupId: null
    };
  },
  mounted() {
    this.groupId = this.$el.id;
  }
};
</script>
