<template>
  <div class="steps__container">
    <!-- Step 1 with background starts -->
    <div
      class="steps steps--background-blue steps--lines-left js-steps-large-blue"
    >
      <div class="steps__inner">
        <div class="container">
          <div class="row">
            <div class="col-12 col-lg-6">
              <h2 class="steps__title title--blue-big">Step One</h2>
              <h3 class="steps__subtitle title--black">
                Choose Your Membership
              </h3>
              <p class="steps__text">
                Choose between FlyLine Basic <br />
                or Premium for great savings!
              </p>
              <router-link
                class="button button--big button--blue"
                :to="{ name: 'membership-explained' }"
                >Learn More</router-link
              >
            </div>
            <div class="col-12 col-lg-6 hide-element-on-mobile">
              <img
                class="steps__logo"
                src="@/assets/img/main-landing/Flyline_Logo_Blk_Whi.svg"
                alt="Logo"
              />
              <div class="steps__image">
                <img
                  class="w-100"
                  src="@/assets/img/main-landing/flight-1.png"
                  alt="Flight 1"
                />
              </div>
              <h4 class="steps__image-title">Other Online Travel Agencies</h4>
              <div class="steps__image">
                <img
                  class="w-100"
                  src="@/assets/img/main-landing/other_otas.png"
                  alt="Flight 1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Step 1 with background ends -->

    <!-- Step 2 with background starts -->
    <div class="steps js-steps-small-blue">
      <div class="container">
        <div class="row">
          <div class="col-12 col-lg-6 hide-element-on-mobile">
            <div class="steps__image">
              <img
                class="w-100"
                src="@/assets/img/main-landing/screen-mockup.png"
                alt="Screen mockup"
              />
            </div>
          </div>

          <div class="col-12 col-lg-6">
            <div class="steps__right">
              <h2 class="steps__title title--blue-big">Step Two</h2>
              <h3 class="steps__subtitle title--black">Search for Savings</h3>
              <p class="steps__text">
                Search our flight inventory to find <br />
                savings up to 60% off
              </p>
              <router-link
                class="button button--big button--blue"
                :to="{ name: 'flyline101' }"
                >Savings Explained</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Step 2 with background ends -->

    <!-- Step 3 with background starts ( Save Instantly) -->
    <div
      class="steps steps--background-blue steps--lines-right js-steps-large-blue"
    >
      <div class="container">
        <div class="row">
          <!-- Left Start -->
          <div class="col-12 col-lg-6">
            <div class="steps__left">
              <h2 class="steps__title title--blue-big">Step Three</h2>
              <h3 class="steps__subtitle title--black">Save Instantly</h3>
              <p class="steps__text">
                Our average member recoups their subscription fee in 3 <br />
                domestic bookings or 1 international booking.
              </p>
              <router-link
                :to="{ name: 'get-started' }"
                class="button button--big button--blue"
                href=""
                >Join Flyline</router-link
              >
            </div>
          </div>
          <!-- Left Ends -->

          <!-- Right Start -->
          <div class="col-12 col-lg-6 hide-element-on-mobile">
            <div class="steps__positioned">
              <div class="steps__overlay">
                <img
                  class="steps__overlay-logo"
                  src="@/assets/img/main-landing/flyline-logo-small.png"
                  alt="Logo"
                />
                <div class="steps__overlay-top">
                  <p>
                    <img
                      class="steps__overlay-icon"
                      src="@/assets/img/main-landing/american-small-logo.png"
                      alt="american"
                    />
                    <span class="steps__overylay-text">DFW</span>
                  </p>
                  <span class="steps__overlay-arrow">-></span>
                  <p>
                    <img
                      class="steps__overlay-icon"
                      src="@/assets/img/main-landing/AS-small-logo.png"
                      alt="AW"
                    />
                    <span class="steps__overylay-text">SEA</span>
                  </p>
                </div>
                <hr />
                <div class="steps__overlay-bottom">
                  <p>Flight Price on FlyLine <span>$210</span></p>
                  <p>Flight Price on other OTA’s <span>$240</span></p>
                  <p>Average Savings <span>$30</span></p>
                </div>
              </div>
              <div class="steps__image">
                <img
                  class="steps__image-save"
                  src="@/assets/img/main-landing/save-instantly.png"
                  alt="Image"
                />
              </div>
            </div>
          </div>
          <!-- Right Ends -->
        </div>
      </div>
    </div>
    <!-- Step 3 with background Ends ( Save Instantly) -->
  </div>
</template>

<script>
export default {
  delimiters: ["{{", "}}"],
  watch: {
    $mq: {
      handler: "reverseBackground"
    }
  },
  mounted() {
    this.reverseBackground();
  },
  methods: {
    reverseBackground() {
      const stepsSmallBlue = document.querySelectorAll(".js-steps-small-blue");
      const stepsLargeBlue = document.querySelectorAll(".js-steps-large-blue");
      if (this.$mq === "sm") {
        stepsSmallBlue.forEach(el =>
          el.classList.add("steps--background-blue")
        );
        stepsLargeBlue.forEach(el =>
          el.classList.remove("steps--background-blue")
        );
      } else {
        stepsSmallBlue.forEach(el =>
          el.classList.remove("steps--background-blue")
        );
        stepsLargeBlue.forEach(el =>
          el.classList.add("steps--background-blue")
        );
      }
    }
  }
};
</script>
