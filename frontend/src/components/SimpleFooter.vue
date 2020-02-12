<template>
  <footer class="simple-footer">
    <router-link :to="{ name: 'terms-of-services' }">
      FlyLine - Terms of Use
    </router-link>
    &nbsp;|&nbsp;
    <router-link :to="{ name: 'privacy-policy' }">
      Privacy Policy
    </router-link>
  </footer>
</template>

<style lang="scss" scoped>
.simple-footer {
  display: block;
  background-color: #f7f9fc;
  color: #929292;
  min-height: 48px;
  padding: 10px;
  text-align: center;
  margin-top: auto;

  a {
    color: #929292;
    padding: 0;
    letter-spacing: 0;
    font-size: 14px;
  }

  @include media-breakpoint-up(md) {
    display: none;
  }
}
</style>
