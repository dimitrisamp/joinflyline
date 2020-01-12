<template>
  <div class="deals-alerts">
    <div class="container">
      <div class="deals-alerts__heading">
        <h3 class="title--black-big">Personalized Deal Alerts</h3>
      </div>
      <div class="row">
        <div class="col-12 col-lg-7">
          <p class="deals-alerts__text">- Set the destination</p>
          <p class="deals-alerts__text">
            - Set the max price you’re willing to pay
          </p>
          <p class="deals-alerts__text">- Choose the airlines you prefer</p>
          <p class="deals-alerts__text">
            - We’ll send you an email when a flight fits your preferences
          </p>
        </div>
        <div class="col-12 col-lg-5">
          <div class="deals-alerts__img">
            <img
              src="@/assets/img/main-landing/deals-alerts.png"
              alt="Deals Alerts"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  delimiters: ["{{", "}}"]
};
</script>
