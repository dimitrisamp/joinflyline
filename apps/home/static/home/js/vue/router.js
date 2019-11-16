import {Home} from "../home.js";
import {SavingsExplained} from "./savings-explained.js";
import {Wizard} from "../wizard.js";
import {LearnMore} from "./learn-more.js";
import {PromoLanding} from "./promo-landing.js";
import {Dashboard} from "./dashboard.js";

const routes = [
    {path: '/', component: Home},
    {path: '/dashboard', component: Dashboard},
    {path: '/savings-explained/', component: SavingsExplained},
    {
        path: '/get-started/:plan?',
        name: 'get-started',
        component: Wizard
    },
    {path: '/learn-more/', component: LearnMore},
    {path: '/promo/', component: PromoLanding},
];

export const router = new VueRouter({
    routes,
});
