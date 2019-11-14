import {Home} from "../home.js";
import {SavingsExplained} from "./savings-explained.js";

const routes = [
    {path: '/', component: Home},
    {path: '/savings-explained/', component: SavingsExplained}
];

export const router = new VueRouter({
    routes,
});
