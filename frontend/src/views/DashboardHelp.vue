<template>
  <div class="help">
    <div class="help__header">
      <h1 class="help__title">How can we help?</h1>
      <p class="help__lead">
        Have a question? Feel free to reach out, we’ll get back with you
        asap.
      </p>
    </div>
    <div class="help__list">
      <div class="help__item" v-for="item in helpItems" :key="item.id">
        <div class="help__item-title">
          {{ item.title }}
        </div>
        <div class="help__item-values">
          <div
            class="help__item-value"
            v-for="(val, index) in item.values"
            :key="`help-value-${index}`"
            v-html="val"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DashboardHelp",
  data() {
    return {
      helpItems: [
        {
          id: 1,
          title: "Pre Membership Inquiries",
          values: [
            "Phone Number : <a href='tel:4693891572'>(469) 389-1572</a>",
            "Email : <a href='mailto:hello@joinflyline.com'>hello@joinflyline.com</a>"
          ]
        },
        {
          id: 2,
          title: "Pre Booking & Technical Questions For Members",
          values: [
            "Phone Number : <a href='tel:4693891572'>(469) 389-1572</a>",
            "Email : <a href='mailto:support@joinflyline.com'>support@joinflyline.com</a>"
          ]
        },
        {
          id: 3,
          title: "Post Booking & Airline Specific Questions",
          values: [
            "Phone Number : <a href='tel:4693891572'>(469) 389-1572</a> (press 1)",
            "Email : <a href='mailto:bookings@joinflyline.com'>bookings@joinflyline.com</a>"
          ]
        },
        {
          id: 4,
          title: "Airline Related Questions",
          values: [
            "Take this link to find the contact number of your airline. <a href='#'>Airline Support Numbers</a>"
          ]
        }
      ]
    };
  }
};
</script>
