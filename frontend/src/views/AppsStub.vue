<template>
  <div class="apps">
    <Header />
    <main class="apps__body">
      <div class="apps__content">
        <div class="container">
          <h1 class="apps__title">
            Get the app <br />
            to go mobile
          </h1>
          <p class="apps__lead">
            Ready to save on flights? Start your 14 day free trial and download
            the FlyLine app on iOS or Android
          </p>
          <div class="apps__badges">
            <img
              width="130"
              class="apps__badge"
              src="@/assets/images/get_on_appstore.svg"
              alt="appstore badge"
            />
            <img
              width="130"
              class="apps__badge"
              src="@/assets/images/get_on_google_play.svg"
              alt="google play badge"
            />
          </div>
        </div>
      </div>
    </main>
    <div class="container pb-5 pt-5">
      <div class="text-center">
        <router-link class="apps__start" :to="{ name: 'get-started' }"
          >Start 14 Day Free Trial
        </router-link>
      </div>
      <br />
      <div class="text-center">
        <router-link class="apps__about" :to="{ name: 'about' }"
          >What is FlyLine
        </router-link>
      </div>
    </div>
    <simple-footer />
  </div>
</template>

<script>
import Header from "../components/Header";
import SimpleFooter from "../components/SimpleFooter";

export default {
  delimiters: ["{{", "}}"],
  components: {
    Header,
    SimpleFooter
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.apps {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-top: 72px;
  margin-top: -72px;
}

.apps__body {
  min-height: 430px;
  background-image: url("../assets/img/coast.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  color: #ffffff;
  position: relative;
  padding-top: 140px;
  padding-bottom: 70px;
  text-align: center;

  &:before {
    content: "";
    top: 0;
    left: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba($color: #000000, $alpha: 0.28);
  }
}

.apps__content {
  position: relative;
  z-index: 1;
}

.apps__title {
  font-weight: 900;
  font-size: 48px;
  margin-bottom: 20px;
  line-height: 1.1;
}

.apps__lead {
  font-weight: bold;
  font-size: 20px;
  color: #ffffff;
  text-align: center;
  line-height: 28px;
  margin-bottom: 50px;
}

.apps__badges {
  display: flex;
  justify-content: center;
}

.apps__badge {
  &:not(:last-child) {
    margin-right: 20px;
  }
}

.apps__start {
  font-weight: 900;
  font-size: 20px;
  color: #ffffff;
  text-align: center;
  display: block;
  background: #00aeef;
  border: 2px solid #00aeef;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  padding: 0.65rem 2rem;
  text-align: center;
}

.apps__about {
  font-weight: 900;
  font-size: 20px;
  color: #000;
  text-align: center;
  display: block;
  background: white;
  border: 2px solid transparent;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  padding: 0.65rem 2rem;
  text-align: center;
}
</style>
