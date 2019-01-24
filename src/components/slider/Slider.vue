<template>
  <div class="slider" @mouseenter="slideStop" @mouseleave="startSlider">
    <div class="slider-wrapper">

    </div>
    <ul>
      <transition-group name="slide">
        <li v-for="(item,i) in banner" :key="item.src" class="pics" v-show="i==index">
          <img :src="item.src" alt="">
        </li>
      </transition-group>
    </ul>
    <div class="dotsWrap">
      <ul>
        <li class="dots">
          <span v-for="num in banner.length" :key='num' class="dot" :class="num-1==index?'active':''">
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'Slider',
    props: {
      banner: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        index: 0
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.startSlider()
      })
    },
    methods: {
      startSlider() {
        this.timer = setInterval(() => {
          this.slide()
        }, 1000)
      },
      slide() {
        if (this.index >= this.banner.length - 1) {
          this.index = 0
          return
        }
        this.index++
      },
      slideStop() {
        clearInterval(this.timer)
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../public/scss/index";

  .slider {
    width: 100%;
    height: 18vh;
    font-size: 0;
    position: relative;
    .slide-enter {
      transform: translateX(100%);
    }
    .slide-leave, .slide-enter-to {
      transform: translateX(0);
    }
    .slide-enter-active, .slide-leave-active {
      transition: all .5s
    }
    .slide-leave-to {
      transform: translateX(-100%);
    }
    .pics {
      width: 100%;
      position: absolute;
      left: 0;
      right: 0;
      img {
        width: 100%;
      }
    }
    .dotsWrap {
      width: 100%;
      .dots {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 10px;
        margin: 0 auto;
        z-index: 20;
        .dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          margin: 2px;
          border-radius: 50%;
          background-color: #fff;
          opacity: 0.7;
          &.active {
            background-color: $color-theme;
          }
        }
      }
    }
  }
</style>
