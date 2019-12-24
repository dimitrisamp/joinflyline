<template>
  <div>
    <nav-bar />
    <no-more-booking-fees />
    <no-more-fomo />
    <no-more-redirects />
    <subscription-plans />
  </div>
</template>

<script>
import SubscriptionPlans from "../components/SubscriptionPlans";
import NavBar from "../components/NavBar";
import NoMoreBookingFees from "../components/NoMoreBookingFees";
import NoMoreFomo from "../components/NoMoreFomo";
import NoMoreRedirects from "../components/NoMoreRedirects";

export default {
  components: {
    NavBar,
    NoMoreBookingFees,
    NoMoreFomo,
    NoMoreRedirects,
    SubscriptionPlans
  },
  delimiters: ["{{", "}}"]
};
</script>
