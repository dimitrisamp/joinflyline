<template>
  <swiper :options="swiperOption" ref="mySwiper">
    <!-- slides -->
    <swiper-slide :key="slide.id" v-for="slide in slides">
      <div class="wizard-slide">
        <div class="wizard-slide__image">
          <img
            :src="require(`@/assets/images/${slide.imgUrl}`)"
            :alt="slide.imgAlt"
            class=""
          />
        </div>
        <div class="wizard-slide__content">
          <h3 class="wizard-slide__title">{{ slide.title }}</h3>
          <h3 class="wizard-slide__text">{{ slide.text }}</h3>
        </div>
      </div>
    </swiper-slide>
    <!-- Optional controls -->
    <div class="swiper-pagination" slot="pagination"></div>
  </swiper>
</template>

<script>
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
export default {
  name: "WizardSlider",
  props: {
    slides: {
      type: Array
    }
  },
  components: {
    swiper,
    swiperSlide
  },
  data() {
    return {
      swiperOption: {
        speed: 800,
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        }
      }
    };
  }
};
</script>

<style lang="scss">
.wizard-slide {
  position: relative;
  height: 100vh;
  width: 100%;
  .wizard-slide__image {
    width: 100%;
    height: 100%;
    position: relative;
    &:after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: transparentize(black, 0.85%);
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top;
    }
  }
  .wizard-slide__content {
    position: absolute;
    top: 0;
    color: white;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .wizard-slide__title {
    text-align: center;
    font-size: 40px;
    line-height: 40px;
    font-family: Dona-Black;
  }
  .wizard-slide__text {
    font-size: 20px;
    max-width: 80%;
    text-align: center;
    line-height: 34px;
    font-family: Dona-Bold;
  }
}
.swiper-container-horizontal > .swiper-pagination-bullets {
  bottom: 40px;
}
.swiper-container-horizontal
  > .swiper-pagination-bullets
  .swiper-pagination-bullet {
  margin: 0 10px;
}
.swiper-pagination-bullet {
  width: 30px;
  height: 30px;
  opacity: 1;
  background: transparent;
  border: 4px solid white;
}
.swiper-pagination-bullet-active {
  opacity: 1;
  background: #00aeef;
  border: 0;
}
</style>
