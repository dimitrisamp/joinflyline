<template>
  <section class="fly-line">
    <!-- Header Start -->
    <header>
      <nav-bar />
    </header>
    <!-- Header Ends-->

    <!--  FlyLine Content Start  -->
    <div class="fly-line__content">
      <div class="container">
        <div class="row">
          <div class="col-12 col-lg-10">
            <div class="fly-line__container">
              <div class="fly-line__item">
                <h2 class="fly-line__title">FlyLine 101</h2>
                <p>A Quick Course in Flight Savings</p>
              </div>
              <div class="fly-line__body">
                <p>
                  We’re an awesome service but we have our limitations. The
                  following is a guide to help you navigate our site towards
                  maximized savings.
                </p>
              </div>
            </div>

            <div class="fly-line__container">
              <div class="fly-line__item">
                <h2 class="fly-line__title">What We Are Great At</h2>
                <p>Five Ways to Save</p>
              </div>
              <div class="fly-line__body">
                <div class="fly-line__body-item">
                  <h3 class="fly-line__title fly-line__title--small">
                    Virtual Interlining
                  </h3>
                  <p>
                    Mashing together one-way flights from different carriers is
                    our jam! With virtual interlining, we can seamlessly provide
                    you with a cheap round trip flight that will make you forget
                    about your airline loyalty. In fact, we’re so good at it we
                    put “line” in our name.
                  </p>
                </div>
                <div class="fly-line__body-item">
                  <h3 class="fly-line__title fly-line__title--small">
                    Basic & Premium Economy
                  </h3>
                  <p>
                    So many seats, so many savings! Airlines have too many
                    economy seats to fill at times and you get to benefit from
                    that abundance, thanks to us.
                  </p>
                </div>
                <div class="fly-line__body-item">
                  <h3 class="fly-line__title fly-line__title--small">
                    International Flights
                  </h3>
                  <p>
                    Big distances = big prices = big potential savings. There is
                    no greater way to save with FlyLine than to book an
                    international flight.
                  </p>
                </div>
                <div class="fly-line__body-item">
                  <h3 class="fly-line__title fly-line__title--small">
                    Legacy Carriers
                  </h3>
                  <p>
                    Unlike low-cost carriers (Spirit, Frontier, etc.), which
                    have already discounted their service down to a wholesale
                    level, Legacy carriers have markups we can help you bypass.
                  </p>
                </div>
                <div class="fly-line__body-item">
                  <h3 class="fly-line__title fly-line__title--small">
                    Major Cities
                  </h3>
                  <p>
                    Denver has a lot of flights and a lot of empty seats. Aspen,
                    not so much. Major cities equal major savings.
                  </p>
                </div>
              </div>
            </div>

            <div class="fly-line__container">
              <div class="fly-line__item">
                <h2 class="fly-line__title">Where We Are Average</h2>
                <p>
                  You won’t overspend with us but you likely won’t save much
                  either
                </p>
              </div>
              <div class="fly-line__body">
                <div class="fly-line__body-item">
                  <h3 class="fly-line__title fly-line__title--small">
                    Business & First Class
                  </h3>
                  <p>
                    In the airline world luxury isn’t discounted often. When it
                    is, we’ll pass it on to you!
                  </p>
                </div>
                <div class="fly-line__body-item">
                  <h3 class="fly-line__title fly-line__title--small">
                    Low Cost Carriers
                  </h3>
                  <p>
                    LCCs are priced so low we can typically only match their
                    prices. We will often give you the option of combining an
                    LCC with a legacy that beats the internet but when it comes
                    to booking a roundtrip LCC flight we are average.
                  </p>
                </div>
                <div class="fly-line__body-item">
                  <h3 class="fly-line__title fly-line__title--small">
                    Last Minute Flights
                  </h3>
                  <p>
                    Inventory on last minute flights (a purchase less than two
                    weeks from departure) is typically low and thus not priced
                    at wholesale rates.
                  </p>
                </div>
              </div>
            </div>

            <div class="fly-line__container">
              <div class="fly-line__item">
                <h2 class="fly-line__title">
                  The Best Way to Search Domestic Bound Flights
                </h2>
                <p>Coast to Coast Savings</p>
              </div>
              <div class="fly-line__body">
                <div class="fly-line__body-item">
                  <ul>
                    <li>
                      Select your domestic destination. Pick a top 25 airport vs
                      a small airport for the best price selection.
                    </li>
                    <li>
                      Be flexible and go with a virtually interlined fare. This
                      is the easiest way to save on domestic air travel with
                      FlyLine. If you’re an airline loyalist follow steps 3-5 to
                      find the cheapest flights on a single carrier.
                    </li>
                    <li>
                      Select a departure date that is at least two weeks out
                    </li>
                    <li>Choose an economy or premium economy seat</li>
                    <li>
                      Choose a legacy carrier (American, Delta, United, etc.)
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="fly-line__container">
              <div class="fly-line__item">
                <h2 class="fly-line__title">
                  The Best Way to Search International Bound Flights
                </h2>
                <p>Go Far. Save Big.</p>
              </div>
              <div class="fly-line__body">
                <div class="fly-line__body-item">
                  <ul>
                    <li>Select your international destination</li>
                    <li>
                      Select a departure date that is at least 2 weeks out.
                    </li>
                    <li>Choose an economy or premium economy seat</li>
                  </ul>
                  <p>
                    Yeah, it’s that easy. We have great rates on international
                    flights! Select one of our virtually interlined fares or
                    further filter for your preferred airline. Either way, we
                    have great deals.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-2">
            <div class="fly-line__lines">
              <span />
              <span />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--  FlyLine Content Ends  -->
    <footer>
      <main-landing-footer />
    </footer>
  </section>
</template>

<script>
import NavBar from "../components/NavBar";
import MainLandingFooter from "../components/MainLandingFooter";

export default {
  components: {
    MainLandingFooter,
    NavBar
  },
  delimiters: ["{{", "}}"]
};
</script>
