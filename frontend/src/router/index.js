import MainLanding from "../views/MainLanding";
import MainLandingAbout from "../components/MainLandingAbout";
import MembershipExplained from "../views/MembershipExplained";
import Flyline101 from "../views/Flyline101";
import PrivacyPolicy from "../views/PrivacyPolicy";
import TermsOfServices from "../views/TermsOfServices";
import Airlines from "../components/Airlines";
import SearchResultsPage from "../views/SearchResultsPage";
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
import Help from "../views/Help";
import Vue from "vue";
import VueRouter from "vue-router";
import PasswordResetConfirm from "../views/PasswordResetConfirm";
import Apps from "../views/Apps";
import AppsStub from "../views/AppsStub";
import DashboardHelp from "../views/DashboardHelp";
import WizardForgetPassword from "../components/WizardForgetPassword";
import WizardUniversal from "../views/WizardUniversal";
import SignInUniversal from "../views/SignInUniversal";

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
    component: SignInUniversal,
    meta: {
      loginRequired: false
    }
  },
  {
    path: "/password-reset",
    name: "password-reset",
    component: WizardForgetPassword,
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
      },
      {
        path: "help",
        name: "dashboard-help",
        component: DashboardHelp,
        meta: {
          loginRequired: true
        }
      }
    ]
  },
  {
    path: "/get-started/:plan?",
    name: "get-started",
    component: WizardUniversal,
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
  },
  {
    path: "/help",
    name: "help",
    component: Help,
    meta: {
      loginRequired: false
    }
  },
  {
    path: "/apps",
    name: "apps",
    component: Apps,
    meta: {
      loginRequired: false
    }
  },
  {
    path: "/apps-stub",
    name: "apps-stub",
    component: AppsStub,
    meta: {
      loginRequired: false
    }
  }
];

const router = new VueRouter({
  mode: "history",
  routes,
  linkActiveClass: "active",
  linkExactActiveClass: "exact-active",
  scrollBehavior(to) {
    if (to.hash) {
      return {
        selector: to.hash
      };
    }
    return { x: 0, y: 0 };
  }
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

router.afterEach(() => {
  window.Intercom("update");
});

export { router };
export default router;
