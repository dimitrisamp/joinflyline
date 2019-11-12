Vue.use(vueMq, {
    breakpoints: { // default breakpoints - customize this
        sm: 768,
        md: 1250,
        lg: Infinity,
    },
    defaultBreakpoint: 'sm' // customize this for SSR
});
