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
import {Faq} from "./components/faq.js";
import {MembershipExplained} from "./components/membership-explained.js";
import {Flyline101} from "./components/flyline101.js";
import {PrivacyPolicy} from "./components/privacy-policy.js";
import {TermsOfServices} from "./components/terms-of-services.js";

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
    path: '/membership-explained',
    name: 'membership-explained',
    component: MembershipExplained
  },
  {
    path: '/flyline101',
    name: 'flyline101',
    component: Flyline101
  },
  {
    path: '/privacy-policy',
    name: 'privacy-policy',
    component: PrivacyPolicy
  },
  {
    path: '/terms-of-services',
    name: 'terms-of-services',
    component: TermsOfServices
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
  {
    path: '/faq/',
    name: 'faq',
    component: Faq
  },
];

const router = new VueRouter({
  // mode: 'history',
  routes,
  linkActiveClass: 'active',
  linkExactActiveClass: 'exact-active',
  scrollBehavior: function (to) {
    if (to.hash) {
      return {
        selector: VueScrollTo.scrollTo(to.hash, 700)
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
