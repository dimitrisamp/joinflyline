<template>
  <div
    class="landing-full-papge"
    style="padding-top: 100px;padding-bottom: 200px;"
  >
    <div class="container">
      <section class="full-section">
        <div class="landing-p-logo">
          <img src="@/assets/img/flyline_logos-01-1.png" />
        </div>
        <strong>No Fees. No Redirects. No FOMO.</strong>
        <p style="margin-top:4px;">
          At FlyLine we hate booking fees, endless flight searches <br />
          and the FOMO that comes with missing out on a deal. So we built a
          better<br />
          booking engine and paired it with a membership model to deliver
          massive savings to our members.
        </p>

        <router-link to="/learn-more/" class="btn btn-default"
          >Learn More</router-link
        >

        <strong style="margin-top: 50px;"
          >Exclusive Dallasites 101 PROMO
          <img src="@/assets/img/dallasites_logo.png" alt="dallasites-logo"
        /></strong>
        <p>Win $500 Booking Credit on Flyline</p>

        <div class="contact-rule-promopage">
          <h3>Contest Rules</h3>
          <ul>
            <li>Follow @joinflyline and @dallasites101</li>
            <li>Head to the link in bio to enter your email and IG handle</li>
            <li>Tag your friend for extra entries</li>
            <li>We will announce a winner in 48 hours!</li>
          </ul>
        </div>
        <p>Win a $500 Booking Credit on FlyLine</p>

        <div class="contact-rule-promopage">
          <h3>Contest Rules</h3>
          <ul>
            <li>Follow @joinflyline and @dallasites101</li>
            <li>Head to the link in bio to enter your email and IG handle</li>
            <li>Tag your friend for extra entries</li>
            <li>We will announce a winner in 48 hours!</li>
          </ul>
        </div>

        <form method="post">
          {% csrf_token %}
          <div class="row">
            <div class="col-md-4 col-12 promo-p-space">
              <div class="form-group landing-manage-form">
                <input
                  class="form-control"
                  type="text"
                  name="email"
                  placeholder="Enter Email Address"
                />
              </div>
            </div>
            <div class="col-md-4 col-12 promo-p-space">
              <div class="form-group landing-manage-form">
                <input
                  class="form-control"
                  type="text"
                  name="instagram"
                  placeholder="Enter Instragram Handle"
                />
              </div>
            </div>
            <div class="col-md-4 col-12 promo-p-space">
              <input
                type="submit"
                class="btn btn-default landing-submit-btn"
                value="Enter to Win"
              />
            </div>
          </div>
        </form>
      </section>
    </div>
    <footer>
      <main-landing-footer />
    </footer>
  </div>
</template>

<script>
import MainLandingFooter from "../components/MainLandingFooter";

export default {
  components: {
    MainLandingFooter
  },
  delimiters: ["{{", "}}"]
};
</script>
