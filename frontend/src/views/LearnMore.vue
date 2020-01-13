<template>
  <div>
    <Header />
    <no-more-booking-fees />
    <no-more-fomo />
    <no-more-redirects />
    <subscription-plans />
  </div>
</template>

<script>
import SubscriptionPlans from "../components/SubscriptionPlans";
import Header from "../components/Header";
import NoMoreBookingFees from "../components/NoMoreBookingFees";
import NoMoreFomo from "../components/NoMoreFomo";
import NoMoreRedirects from "../components/NoMoreRedirects";

export default {
  components: {
    Header,
    NoMoreBookingFees,
    NoMoreFomo,
    NoMoreRedirects,
    SubscriptionPlans
  },
  delimiters: ["{{", "}}"]
};
</script>
