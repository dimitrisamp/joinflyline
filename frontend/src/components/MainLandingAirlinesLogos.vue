<template>
  <div class="airlines-logos">
    <div class="container">
      <div class="airlines-logos__center">
        <h3 class="title--black-big">Fly All Your Favorite Airlines</h3>
        <p class="airlines-logos__text">
          Easily pay less for the flights you're already booking online
        </p>
      </div>

      <div class="airlines-logos__container">
        <div class="airlines-logos__item">
          <img
            src="@/assets/img/main-landing/alaska_airlines.png"
            alt="Alaska Airlines"
            class="airlines-logos__logo"
          />
        </div>

        <div class="airlines-logos__item">
          <img
            src="@/assets/img/main-landing/aa-logo-web.png"
            alt="Americal Airlines"
            class="airlines-logos__logo"
          />
        </div>

        <div class="airlines-logos__item">
          <img
            src="@/assets/img/main-landing/qantas_airlines_logo.png"
            alt="Qantas Airlines"
            class="airlines-logos__logo"
          />
        </div>

        <div class="airlines-logos__item">
          <img
            src="@/assets/img/main-landing/delta-logo.png"
            alt="Delta Airlines"
            class="airlines-logos__logo"
          />
        </div>

        <div class="airlines-logos__item">
          <img
            src="@/assets/img/main-landing/aerlingus.png"
            alt="Aer
          Lingus Airlines"
            class="airlines-logos__logo"
          />
        </div>

        <div class="airlines-logos__item">
          <img
            src="@/assets/img/main-landing/southwest-airlines-logo.png"
            alt="Southwest
          Airlines"
            class="airlines-logos__logo"
          />
        </div>

        <div class="airlines-logos__item">
          <img
            src="@/assets/img/main-landing/emirates-logo.png"
            alt="Emirates Airlines"
            class="airlines-logos__logo"
          />
        </div>

        <div class="airlines-logos__item">
          <img
            src="@/assets/img/main-landing/easyJet_logo.png"
            alt="easyJet Airlines"
            class="airlines-logos__logo"
          />
        </div>

        <div class="airlines-logos__item">
          <img
            src="@/assets/img/main-landing/jetBlue_airways_logo.png"
            alt="jetBlue Airlines"
            class="airlines-logos__logo"
          />
        </div>

        <div class="airlines-logos__item">
          <img
            src="@/assets/img/main-landing/air_asia-logo.png"
            alt="Air Asia Airlines"
            class="airlines-logos__logo"
          />
        </div>

        <div class="airlines-logos__item">
          <img
            src="@/assets/img/main-landing/air-france.png"
            alt="Airfrance Airlines"
            class="airlines-logos__logo"
          />
        </div>

        <div class="airlines-logos__item airlines-logos__item--klm">
          <img
            src="@/assets/img/main-landing/klm_logo.png"
            alt="KLM
          Airlines"
            class="airlines-logos__logo"
          />
        </div>
      </div>
      <div class="text-center">
        <router-link :to="{ name: 'airlines' }" class="airlines-logos__text"
          >View all</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  delimiters: ["{{", "}}"]
};
</script>
