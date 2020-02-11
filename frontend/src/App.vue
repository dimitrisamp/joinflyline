<template>
  <div id="app" class="app">
    <apps-stub v-if="$mq === 'sm'"></apps-stub>
    <router-view v-else />
  </div>
</template>
<script>
import AppsStub from "./views/AppsStub";

export default {
  components: {
    appsStub: AppsStub
  }
};
</script>
<style lang="scss">
@import "./assets/css/resultpage-mobile-view.css";
@import "./assets/css/dropdown.css";
@import "./assets/css/footer.css";
@import "./assets/css/results.css";
@import "./assets/css/progress-animation-blue.css";
@import "./assets/css/font-awesome.css";
@import "./assets/css/loading-animation.css";
@import "~lightpick/css/lightpick.css";
@import "~vue-slider-component/theme/default.css";
@import "./assets/styles/main.scss";
</style>
