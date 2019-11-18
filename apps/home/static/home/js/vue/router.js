import {Home} from "./components/home.js";
import {SavingsExplained} from "./components/savings-explained.js";
import {Wizard} from "./components/wizard.js";
import {LearnMore} from "./components/learn-more.js";
import {PromoLanding} from "./components/promo-landing.js";
import {Dashboard} from "./components/dashboard.js";
import {Trips} from "./components/trips.js";

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/dashboard',
    component: Dashboard,
    children: [
      {
        path: 'trips',
        name: 'trips',
        component: Trips
      }
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

export const router = new VueRouter({
  routes,
  linkActiveClass: 'sidebar__link-active',
});
