import {Home} from "../home.js";
import {SavingsExplained} from "./savings-explained.js";
import {Wizard} from "../wizard.js";

const routes = [
    {path: '/', component: Home},
    {path: '/savings-explained/', component: SavingsExplained},
    {path: '/get-started/', component: Wizard}
];

export const router = new VueRouter({
    routes,
});
