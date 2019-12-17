<template>
  <div class="totals">
    <div class="top-progress">
      <div class="top-progress__indicator" :class="{ busy: busy }"></div>
    </div>
    <h3 class="totals__heading">Trip Summary</h3>
    <div class="totals__item">
      <span class="totals__name"
        >{{ count.pnum }} Passenger{{ count.pnum > 1 ? "s" : "" }}</span
      >
      <span class="totals__value">${{ prices.passengers }}</span>
    </div>
    <div class="totals__item">
      <span class="totals__name">Baggage</span>
      <span class="totals__value">{{ prices.baggage }}</span>
    </div>
    <div class="totals__item">
      <span class="totals__name">Automatic flight check-in</span>
      <span class="totals__value--free">Free</span>
    </div>
    <div class="totals__grandtotal">
      <span class="totals__name">Trip Total</span>
      <span class="totals__value">${{ prices.total }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["prices", "count", "busy"],
  delimiters: ["{{", "}}"]
};
</script>
