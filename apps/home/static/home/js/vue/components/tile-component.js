export const TileComponent = Vue.component('tile-component', {
    template: '#vue-tile-component-template',
    delimiters: ['[[', ']]'],
    props: {
        title: String,
        titleRight: String,
        multiTitle: Boolean,
        empty: Boolean
    }
});
