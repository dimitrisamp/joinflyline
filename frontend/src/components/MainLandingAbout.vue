<template>
  <section class="about">
    <!-- Header Start -->
    <Header />
    <!-- Header Ends-->
    <!-- About Text Start -->
    <div class="container">
      <div class="about__container">
        <h1 class="about__title">
          We’re on a Mission to help <br />
          people spend less and travel more.
        </h1>
        <h4 class="about__subtitle">
          Save up to 60% on FlyLine fares and access the best flight deals on
          the net
        </h4>
        <p class="about__text">
          It’s easy to spend money on travel but getting the most value is a
          different story. <br />
          Take trip planning for example. Finding the best deal takes time,
          prices change <br />
          depending on many variables, and pricing isn’t always transparent. We
          don’t think that’s fair.
        </p>
        <p class="about__text">
          FlyLine is here to help. We give everyone the tools it takes to find
          the best savings, perks, and all around value <br />
          We then make them easy-to-use with a straight forward membership
          model, so you can always spend with confidence. <br />
        </p>
      </div>
    </div>
    <!-- About Text Ends -->
    <!-- About Stats Start -->
    <div class="about__stats">
      <div class="container">
        <div class="row">
          <div class="col-12 col-lg-4">
            <div class="about__stats-item">
              <p class="about__stats-text">Average Savings of</p>
              <p class="about__stats-number">10-15%</p>
              <p class="about__stats-text">
                on domestic multi-carrier bookings
              </p>
            </div>
          </div>
          <div class="col-12 col-lg-4">
            <div class="about__stats-item">
              <p class="about__stats-text">Average Savings of</p>
              <p class="about__stats-number">20-60%</p>
              <p class="about__stats-text">on international bookings</p>
            </div>
          </div>
          <div class="col-12 col-lg-4">
            <div class="about__stats-item">
              <p class="about__stats-text">Fly Over</p>
              <p class="about__stats-number">250+</p>
              <p class="about__stats-text">airlines with FlyLine</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- About Stats Ends -->
    <!-- Tabs Start -->
    <div class="tabs__container" id="travel-tool-kit">
      <div class="container">
        <h2 class="tabs__heading">Our Travel Tool Kit</h2>
        <p class="tabs__subtitle">
          A better way to book travel is closer than you think. Put FlyLine to
          work for you.
        </p>
        <tabs>
          <tab :selected="true" title="FlyLine Search & Booking Engine">
            <div class="container">
              <div class="row">
                <div class="col-12 col-lg-5">
                  <h2 class="tabs__content-title">
                    FlyLine Search & Booking Engine
                  </h2>
                  <p class="tabs__content-text">
                    Save up to 60% on FlyLine fares <br />
                    and get access to the Internets best deals
                  </p>
                </div>
                <div class="col-12 col-lg-5">
                  <img
                    class="tabs__content-image-screen"
                    src="@/assets/img/main-landing/screen.png"
                    alt="Screen"
                  />
                </div>
              </div>
            </div>
          </tab>
          <tab title="Virtual Inerlining">
            <h2 class="tabs__content-title">
              Virtual Interlining
              <span>
                <img src="@/assets/img/main-landing/WN.png" alt="WN" />
                -> <img src="@/assets/img/main-landing/DL.png" alt="DL" />
              </span>
            </h2>
            <p class="tabs__content-text">
              Some of the best flight deals involve multi-carrier flights. With
              other booking sites <br />
              you would have to book each of these flights separately but with
              FlyLine it’s one <br />
              simple transaction using virtual interlining technology. <br />
              Worried about baggage transfers and missed connections? <br />
              Don't worry our GDS guarantee covers you.
            </p>
          </tab>
          <tab title="Deal Alerts">
            <div class="container">
              <h2 class="tabs__content-title">Deals Alert</h2>
              <div class="row">
                <div class="col-12 col-lg-7">
                  <p class="tabs__content-text">
                    Hunting for deals takes time you don’t have and many of the
                    deal sites send you deals you don’t want to see. With
                    FlyLine you can customize the deal alerts you receive to
                    maximize your savings and get the most out of your
                    membership.
                  </p>
                </div>
                <div class="col-12 col-lg-5">
                  <img
                    class="w-100"
                    src="@/assets/img/main-landing/deal-flight.png"
                    alt="flight"
                  />
                </div>
              </div>
            </div>
          </tab>
          <tab title="Automatic Check-in">
            <h2 class="tabs__content-title">Automatic Check-in</h2>
            <p class="tabs__content-text">
              Never get a bad boarding group again with automatic 24-hour
              check-in on every flight purchase.
            </p>
          </tab>
        </tabs>
      </div>
    </div>
    <!-- Tabs Ends -->
    <!-- Business Model Start -->
    <div class="business-model">
      <div class="container">
        <div class="business-model__container">
          <h2 class="business-model__title">Our Business Model</h2>
          <h4 class="text-center mb-4">Source of Savings</h4>
          <p class="business-model__text">
            Airlines publish flights to the Airline Tariff Publishing Company
            (ATPCO), where we access them via <br />

            the Global Distribution System (GDS) and pass them on to you, our
            members, at their low wholesale rate. <br />

            We take the savings a step further by also offering virtually
            interlined flights at the same wholesale rate. <br />

            These incredibly cheap fare options are created by connecting
            discounted flights<br />between carriers into a singular fare for
            unmatched savings. <br />

            If our wholesale FlyLine fare isn’t the lowest available on the net
            <br />
            we’ll show you what is so you can always book with confidence and
            save!
          </p>
          <h4 class="text-center mb-4">Customer Alignment</h4>
          <p class="business-model__text">
            We generate revenue through memberships versus marking up our fares
            <br />
            to align ourselves with our customer's pursuit of savings and to
            reward loyalty.
          </p>
        </div>
      </div>
    </div>
    <!-- Business Model Ends -->
    <footer>
      <main-landing-footer />
    </footer>
  </section>
</template>

<script>
import MainLandingFooter from "./MainLandingFooter";
import Tab from "./Tab";
import Tabs from "./Tabs";
import Header from "./Header";

export default {
  components: {
    "main-landing-footer": MainLandingFooter,
    Tabs,
    Tab,
    Header
  },
  delimiters: ["{{", "}}"]
};
</script>
