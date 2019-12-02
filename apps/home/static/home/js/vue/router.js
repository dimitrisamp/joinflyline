import {SavingsExplained} from "./components/savings-explained.js";
import {Wizard} from "./components/wizard.js";
import {LearnMore} from "./components/learn-more.js";
import {PromoLanding} from "./components/promo-landing.js";
import {Dashboard} from "./components/dashboard.js";
import {Trips} from "./components/trips.js";
import {DashboadOverview} from "./components/dashboad-overview.js";
import {AccountInformation} from "./components/account-information.js";
import {ResultComponent} from "./components/result-component.js";
import {SearchResultsPage} from "./components/search-results-page.js";
import {SignIn} from "./components/sign-in.js"
import {MainLanding} from "./components/main-landing.js"
import {BookingPage} from "./components/booking-page.js";
import {MainLandingAbout} from "./components/main-landing-about.js"

import { store } from './store.js';

const routes = [
  {
    path: '/',
    name: 'index',
    component: MainLanding,
    beforeEnter(to, from, next) {
      if (!store.getters.user.anonymous) {
        next({name: 'overview'});
      } else {
        next();
      }
    }
  },
  {
    path: '/about',
    name: 'about',
    component: MainLandingAbout
  },
  {
    path: '/search-results',
    name: 'search-results',
    component: SearchResultsPage
  },
  {
    path: '/sign-in',
    name: 'sign-in',
    component: SignIn
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    beforeEnter(to, from, next) {
      if (store.getters.user.anonymous) {
        next({name: 'index'});
      } else {
        next();
      }
    },
    children: [
      {
        path: '',
        name: 'overview',
        component: DashboadOverview,
      },
      {
        path: 'trips',
        name: 'trips',
        component: Trips
      },
      {
        path: 'results',
        name: 'results',
        component: ResultComponent
      },
      {
        path: 'account',
        name: 'account',
        component: AccountInformation
      },
      {
        path: 'booking',
        name: 'booking',
        component: BookingPage,
      },
    ]
  },
  {
    path: '/savings-explained/',
    component: SavingsExplained
  },
  {
    path: '/get-started/:plan?',
    name: 'get-started',
    component: Wizard
  },
  {
    path: '/learn-more/',
    component: LearnMore
  },
  {
    path: '/promo/',
    component: PromoLanding
  },
];

const router = new VueRouter({
  routes,
  linkActiveClass: 'active',
  linkExactActiveClass: 'exact-active',
  scrollBehavior: function (to) {
    if (to.hash) {
      return {
        selector: to.hash
      }
    } else {
      return {x: 0, y: 0}
    }
  },
});

router.beforeEach((to, from, next) => {
  store.dispatch("initializeUser").then(() => {
    next();
  }).catch(error => {
    console.error(error);
    next();
  });
  store.dispatch("initializePlans");
});

export { router }
