import {Home} from "../home.js";
import {SavingsExplained} from "./savings-explained.js";
import {Wizard} from "../wizard.js";
import {LearnMore} from "./learn-more.js";

const routes = [
    {path: '/', component: Home},
    {path: '/savings-explained/', component: SavingsExplained},
    {path: '/get-started/', component: Wizard},
    {path: '/learn-more/', component: LearnMore},
];

export const router = new VueRouter({
    routes,
});
