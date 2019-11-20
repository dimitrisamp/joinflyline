import {initializeAnimation} from "../../rotate-animationscript.js";

Vue.component('cd-intro', {
    template: '#vue-cd-intro-template',
    delimiters: ['{(', ')}'],
    mounted() {
        initializeAnimation();
    }
});
