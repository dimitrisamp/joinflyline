<template>
  <div class="main-footer">
    <div class="container">
      <div class="row">
        <div class="col-6 col-md-2">
          <h4 class="main-footer__title">Products</h4>
          <!-- 
          Membership Plans
          Virtual Interlining
          Deal Alerts
          Auto Check-in 
          -->
          <ul class="main-footer__list">
            <li class="main-footer__item">
              <router-link
                class="main-footer__link"
                :to="{ name: 'membership-explained' }"
                >Subscription Plans</router-link
              >
            </li>
            <li class="main-footer__item">
              <router-link
                class="main-footer__link"
                :to="{ name: 'about', hash: '#travel-tool-kit' }"
                >Travel Features</router-link
              >
            </li>
            <li class="main-footer__item">
              <router-link
                class="main-footer__link"
                :to="{ name: 'membership-explained' }"
                >Membership 101</router-link
              >
            </li>
            <li class="main-footer__item">
              <router-link class="main-footer__link" :to="{ name: 'apps' }"
                >Download App</router-link
              >
            </li>
          </ul>
        </div>
        <div class="col-6 col-md-2">
          <h4 class="main-footer__title">Company</h4>
          <ul class="main-footer__list">
            <li class="main-footer__item">
              <router-link
                :to="{ name: 'about' }"
                class="main-footer__link"
                href="/"
                >About</router-link
              >
            </li>
            <li class="main-footer__item">
              <router-link
                :to="{ name: 'flyline101' }"
                class="main-footer__link"
                href="/"
                >Flyline 101</router-link
              >
            </li>
            <li class="main-footer__item">
              <a
                href="https://intercom.help/flyline/en"
                class="main-footer__link"
                >FAQ</a
              >
            </li>
            <li class="main-footer__item">
              <router-link class="main-footer__link" :to="{ name: 'help' }"
                >Support</router-link
              >
            </li>
            <li class="main-footer__item">
              <router-link class="main-footer__link" :to="{ name: 'airlines' }"
                >Airlines</router-link
              >
            </li>
          </ul>
        </div>
        <div class="col-6 col-md-2">
          <h4 class="main-footer__title">Legal</h4>
          <ul class="main-footer__list">
            <li class="main-footer__item">
              <router-link
                class="main-footer__link"
                :to="{ name: 'terms-of-services' }"
                >Terms of Use</router-link
              >
            </li>
            <li class="main-footer__item">
              <router-link
                class="main-footer__link"
                :to="{ name: 'privacy-policy' }"
                >Privacy Policy</router-link
              >
            </li>
          </ul>
        </div>
        <div class="col-6 col-md-2">
          <h4 class="main-footer__title">Social Media</h4>
          <ul class="main-footer__list">
            <li class="main-footer__item">
              <a
                class="main-footer__link"
                target="_blank"
                href="https://www.instagram.com/joinflyline/"
                >Instagram</a
              >
            </li>
            <li class="main-footer__item">
              <a
                class="main-footer__link"
                target="_blank"
                href="https://twitter.com/joinflyline"
                >Twitter</a
              >
            </li>
          </ul>
        </div>
        <!-- <div class="col">
          <h4 class="main-footer__title">App Coming Soon</h4>
          <ul class="main-footer__list">
            <li class="main-footer__item">
              <a class="main-footer__link" href="/">
                <img
                  class="main-footer__social"
                  src="@/assets/img/main-landing/apple-logo.svg"
                  alt="App Store Download"
                />
              </a>
            </li>
            <li class="main-footer__item">
              <a class="main-footer__link" href="/">
                <img
                  class="main-footer__social"
                  src="@/assets/img/main-landing/googlePlay-logo.svg"
                  alt="Google Play Download"
                />
              </a>
            </li>
          </ul>
        </div> -->
        <div class="col-12 col-md-4 order-md-first">
          <div>
            <router-link
              class="navbar-brand nav-logo flex-grow-1"
              :to="{ name: 'index' }"
            >
              <img src="@/assets/img/flyline_logos-01-1.png" />
            </router-link>
          </div>
          <br />
          <p class="font-weight-bold">© 2020 FlyLine. All rights reserved.</p>
        </div>
      </div>
    </div>
  </div>
</template>
