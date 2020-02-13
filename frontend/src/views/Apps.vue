<template>
  <div class="apps">
    <Header />
    <main class="apps__main">
      <div class="container">
        <div class="apps__body">
          <div class="apps__img">
            <img
              class="apps__img-src"
              src="@/assets/images/phone_with_app_compressed.png"
              alt="appstore badge"
              style="width: 350px;"
            />
          </div>
          <div class="apps__content">
            <h1 class="apps__title">Get the app to go mobile</h1>
            <p class="apps__lead">
              For the best FlyLine experience, use our desktop web app <br /> or
              download our iOS or Android mobile app. Saving money on <br />
              flights has never been easier.
            </p>
            <div class="apps__badges">
              <a href="#" target="_blank" class="apps__badge">
                <img
                  width="130"
                  src="@/assets/images/get_on_appstore.svg"
                  alt="appstore badge"
                />
              </a>
              <a href="#" target="_blank" class="apps__badge">
                <img
                  width="130"
                  src="@/assets/images/get_on_google_play.svg"
                  alt="google play badge"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
    <footer><main-landing-footer /></footer>
  </div>
</template>

<script>
import Header from "../components/Header";
import MainLandingFooter from "../components/MainLandingFooter";

export default {
  delimiters: ["{{", "}}"],
  components: {
    Header,
    MainLandingFooter
  },
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>
.apps {
  .header {
    border-bottom: 1px solid #c5c5c5;
  }
}

.apps__main {
  // padding: 60px 0;
}

.apps__body {
  margin-top: 80px;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.apps__img {
}

.apps__img-src {
  margin-top: 4rem;
  margin-right: 2rem;
  margin-left: 2rem;
  margin-bottom: 4rem;
}

.apps__title {
  font-weight: 900;
  font-size: 40px;
  color: #000000;
  line-height: 60px;
}

.apps__lead {
  font-weight: 600;
  font-size: 16px;
  color: #b2b2b2;
  line-height: 30px;
  padding-bottom: 20px;
}

.apps__badges {
  display: flex;
}

.apps__badge {
  &:not(:last-child) {
    margin-right: 20px;
  }
}
</style>
