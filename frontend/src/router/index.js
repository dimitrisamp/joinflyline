import Wizard from "../views/Wizard";
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
import PasswordReset from "../views/PasswordReset";
import PasswordResetConfirm from "../views/PasswordResetConfirm";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "index",
    component: MainLanding,
    meta: {
      loginRequired: false
    }
  },
  {
    path: "/about",
    name: "about",
    component: MainLandingAbout,
    meta: {
      loginRequired: false
    }
  },
  {
    path: "/membership-explained",
    name: "membership-explained",
    component: MembershipExplained,
    meta: {
      loginRequired: false
    }
  },
  {
    path: "/flyline101",
    name: "flyline101",
    component: Flyline101,
    meta: {
      loginRequired: false
    }
  },
  {
    path: "/privacy-policy",
    name: "privacy-policy",
    component: PrivacyPolicy,
    meta: {
      loginRequired: false
    }
  },
  {
    path: "/terms-of-services",
    name: "terms-of-services",
    component: TermsOfServices,
    meta: {
      loginRequired: false
    }
  },
  {
    path: "/airlines",
    name: "airlines",
    component: Airlines,
    meta: {
      loginRequired: false
    }
  },
  {
    path: "/search-results",
    component: SearchResultsPage,
    children: [
      {
        path: "",
        name: "search-results",
        component: SearchResultComponent,
        meta: {
          loginRequired: false
        }
      },
      {
        path: "booking",
        name: "search-booking",
        component: SearchBookingPage,
        meta: {
          loginRequired: false
        }
      }
    ]
  },
  {
    path: "/sign-in",
    name: "sign-in",
    component: SignIn,
    meta: {
      loginRequired: false
    }
  },
  {
    path: "/password-reset",
    name: "password-reset",
    component: PasswordReset,
    meta: {
      loginRequired: false
    }
  },
  {
    path: "/password-reset/confirm",
    name: "password-reset-confirm",
    component: PasswordResetConfirm,
    meta: {
      loginRequired: false
    }
  },
  {
    path: "/dashboard",
    component: Dashboard,
    children: [
      {
        path: "",
        name: "overview",
        component: DashboadOverview,
        meta: {
          loginRequired: true
        }
      },
      {
        path: "trips",
        name: "trips",
        component: Trips,
        meta: {
          loginRequired: true
        }
      },
      {
        path: "results",
        name: "results",
        component: ResultComponent,
        meta: {
          loginRequired: true
        }
      },
      {
        path: "account",
        name: "account",
        component: AccountInformation,
        meta: {
          loginRequired: true
        }
      },
      {
        path: "booking",
        name: "booking",
        component: BookingPage,
        meta: {
          loginRequired: true
        }
      }
    ]
  },
  {
    path: "/get-started/:plan?",
    name: "get-started",
    component: Wizard,
    meta: {
      loginRequired: false
    }
  },
  {
    path: "/learn-more/",
    component: LearnMore,
    meta: {
      loginRequired: false
    }
  },
  {
    path: "/promo/",
    component: PromoLanding,
    meta: {
      loginRequired: false
    }
  },
  {
    path: "/faq/",
    name: "faq",
    component: Faq,
    meta: {
      loginRequired: false
    }
  }
];

const router = new VueRouter({
  mode: "history",
  routes,
  linkActiveClass: "active",
  linkExactActiveClass: "exact-active"
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.loginRequired)) {
    if (localStorage.getItem("authToken") == null) {
      next({
        name: "sign-in"
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export { router };
export default router;
