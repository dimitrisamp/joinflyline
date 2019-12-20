import Wizard from "../views/Wizard";
import { store } from "../store";
import MainLanding from "../views/MainLanding";
import MainLandingAbout from "../components/MainLandingAbout";
import MembershipExplained from "../views/MembershipExplained";
import Flyline101 from "../views/Flyline101";
import PrivacyPolicy from "../views/PrivacyPolicy";
import TermsOfServices from "../views/TermsOfServices";
import Airlines from "../components/Airlines";
import SearchResultsPage from "../views/SearchResultsPage";
import SignIn from "../views/SignIn";
import Dashboard from "../views/Dashboard";
import DashboadOverview from "../views/DashboadOverview";
import Trips from "../components/Trips";
import ResultComponent from "../components/ResultComponent";
import AccountInformation from "../views/AccountInformation";
import BookingPage from "../views/BookingPage";
import SearchBookingPage from "../views/SearchBookingPage";
import SearchResultComponent from "../components/SearchResultComponent";
import LearnMore from "../views/LearnMore";
import PromoLanding from "../views/PromoLanding";
import Faq from "../views/Faq";
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "index",
    component: MainLanding,
    beforeEnter(to, from, next) {
      if (!store.state.user.user.anonymous) {
        next({ name: "overview" });
      } else {
        next();
      }
    }
  },
  {
    path: "/about",
    name: "about",
    component: MainLandingAbout
  },
  {
    path: "/membership-explained",
    name: "membership-explained",
    component: MembershipExplained
  },
  {
    path: "/flyline101",
    name: "flyline101",
    component: Flyline101
  },
  {
    path: "/privacy-policy",
    name: "privacy-policy",
    component: PrivacyPolicy
  },
  {
    path: "/terms-of-services",
    name: "terms-of-services",
    component: TermsOfServices
  },
  {
    path: "/airlines",
    name: "airlines",
    component: Airlines
  },
  {
    path: "/search-results",
    component: SearchResultsPage,
    children: [
      {
        path: "",
        name: "search-results",
        component: SearchResultComponent
      },
      {
        path: "booking",
        name: "search-booking",
        component: SearchBookingPage
      },
    ]
  },
  {
    path: "/sign-in",
    name: "sign-in",
    component: SignIn
  },
  {
    path: "/dashboard",
    component: Dashboard,
    beforeEnter(to, from, next) {
      if (store.state.user.user.anonymous) {
//        next({ name: "index" });
        next();
      } else {
        next();
      }
    },
    children: [
      {
        path: "",
        name: "overview",
        component: DashboadOverview
      },
      {
        path: "trips",
        name: "trips",
        component: Trips
      },
      {
        path: "results",
        name: "results",
        component: ResultComponent
      },
      {
        path: "account",
        name: "account",
        component: AccountInformation
      },
      {
        path: "booking",
        name: "booking",
        component: BookingPage
      }
    ]
  },
  {
    path: "/get-started/:plan?",
    name: "get-started",
    component: Wizard
  },
  {
    path: "/learn-more/",
    component: LearnMore
  },
  {
    path: "/promo/",
    component: PromoLanding
  },
  {
    path: "/faq/",
    name: "faq",
    component: Faq
  }
];

const router = new VueRouter({
  mode: "history",
  routes,
  linkActiveClass: "active",
  linkExactActiveClass: "exact-active"
});

router.beforeEach((to, from, next) => {
  store
    .dispatch("user/initializeUser")
    .then(() => {
      next();
    })
    .catch(() => {
      next();
    });
  store.dispatch("plans/initializePlans");
});

export { router };
export default router;
