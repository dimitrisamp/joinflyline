<template>
  <div class="apps">
    <header class="apps__header">
      <router-link
        class="navbar-brand nav-logo flex-grow-1"
        :to="{ name: 'index' }"
      >
        <img src="@/assets/img/flyline_logos-01-1.png" />
      </router-link>
    </header>
    <main class="apps__body">
      <div class="apps__content">
        <div class="container">
          <h1 class="apps__title">
            Get the app <br />
            to go mobile
          </h1>
          <p class="apps__lead">
            For the best mobile FlyLine <br />
            experince download our free app.
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
    <div class="container">
      <div class="text-center">
        <router-link class="apps__about" :to="{ name: 'about' }"
          >What is FlyLine
        </router-link>
      </div>
    </div>
    <footer class="apps__footer">
      <router-link :to="{ name: 'terms-of-services' }">
        FlyLine - Terms of Use
      </router-link>
      &nbsp;|&nbsp;
      <router-link :to="{ name: 'privacy-policy' }">
        Privacy Policy
      </router-link>
    </footer>
  </div>
</template>

<script>
export default {
  delimiters: ["{{", "}}"],
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

.apps__header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 17px;
  text-align: center;
  z-index: 2;
  background: white;
}

.apps__body {
  min-height: 430px;
  background-image: url("../assets/img/miami.png");
  background-repeat: no-repeat;
  background-size: cover;
  color: #ffffff;
  position: relative;
  padding-top: 90px;
  padding-bottom: 55px;
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

.apps__about {
  font-weight: 900;
  font-size: 20px;
  color: #ffffff;
  text-align: center;
  display: inline-block;
  background: #00aeef;
  border: 2px solid #00aeef;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  padding: 0.65rem 2rem;
  text-align: center;
  margin: 40px 0;
}

.apps__footer {
  display: block;
  background-color: #f7f9fc;
  color: #929292;
  min-height: 48px;
  padding: 10px;
  text-align: center;
  margin-top: auto;

  a {
    color: #929292;
    padding: 0;
    letter-spacing: 0;
    font-size: 14px;
  }
}
</style>
