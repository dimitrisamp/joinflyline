module.exports = {
  publicPath: process.env.VUE_PUBLIC_PATH,
  css: {
    loaderOptions: {
      // pass options to sass-loader
      // @/ is an alias to src/
      // so this assumes you have a file named `src/variables.sass`
      // Note: this option is named as "data" in sass-loader v7
      scss: {
        prependData:
          '@import "~bootstrap/scss/functions"; @import "~@/assets/styles/variables.scss"; @import "~bootstrap/scss/mixins"; @import "~bootstrap/scss/utilities";'
      }
    }
  }
};
