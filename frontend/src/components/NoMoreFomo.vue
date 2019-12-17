<template>
  <div class="section fp-auto-height-responsive fp-section" id="sec3-Bg">
    <div class="container">
      <div class="row">
        <div class="col-md-6 col-12">
          <div class="section3-content">
            <h3>No More FOMO</h3>
            <p>
              Our members never miss out on <br />
              massive savings and once-in-a-lifetime
              <br />
              trips through personalized <br />
              deal alerts based on their specific
              <br />
              travel preferences.
            </p>
          </div>
        </div>
        <div class="col-md-6 col-12">
          <ul class="h-result-list">
            <marquee
              behavior="alternate"
              direction="up"
              height="500"
              scrolldelay="1"
              onmouseover="this.stop()"
              onmouseout="this.start()"
            >
              <li><img src="@/assets/img/flight_option_one.png" /></li>
              <li><img src="@/assets/img/flight_option_two.png" /></li>
              <li>
                <img src="@/assets/img/flight_option_three.png" />
              </li>
              <li>
                <img src="@/assets/img/flight_option_four.png" />
              </li>
              <li><img src="@/assets/img/Sevem.png" /></li>
              <li><img src="@/assets/img/Three.png" /></li>
              <li><img src="@/assets/img/One.png" /></li>
              <li><img src="@/assets/img/Two.png" /></li>
              <li><img src="@/assets/img/Five.png" /></li>
              <li><img src="@/assets/img/Six.png" /></li>
            </marquee>
          </ul>
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
