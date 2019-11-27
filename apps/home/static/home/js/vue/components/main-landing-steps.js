export const MainLandingSteps = Vue.component('main-landing-steps', {
    template: '#vue-main-landing-steps-template',
    delimiters: ['[[', ']]'],
    watch: {
      $mq: {
        handler: 'reverseBackground',
      }
    },
    mounted() {
      this.reverseBackground();
    },
    methods: {
      reverseBackground() {
        const stepsSmallBlue = document.querySelectorAll('.js-steps-small-blue');
        const stepsLargeBlue = document.querySelectorAll('.js-steps-large-blue');
        if ( this.$mq == 'sm' ) {
          stepsSmallBlue.forEach(el => el.classList.add('steps--background-blue'))
          stepsLargeBlue.forEach(el => el.classList.remove('steps--background-blue'))
        } else {
          stepsSmallBlue.forEach(el => el.classList.remove('steps--background-blue'))
          stepsLargeBlue.forEach(el => el.classList.add('steps--background-blue'))
        }
      }
    }
});
