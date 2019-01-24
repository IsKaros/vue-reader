<template>
  <div class="star">
    <span v-for="(item,index) in classMap" :key="index" :class="item"></span>
  </div>
</template>
<script>
  const LENGTH = 5
  const ON = 'on'
  const OFF = 'off'
  export default {
    name: 'Star',
    props: {
      score: {
        type: Number,
        required: true
      }
    },
    computed: {
      classMap() {
        let result = []
        for (let i = 0; i < LENGTH; i++) {
          if (this.score > i) {
            result.push(ON)
          } else {
            result.push(OFF)
          }
        }
        return result
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../public/scss/mixin";
  .star {
    width: 100%;
    height: 12px;
    padding: 1vh 0;
    span{
      display: inline-block;
      height: 14px;
      width: 14px;
      &.on {
        @include bg-img('../../public/img/star24_on',12px 12px);
      }
      &.off {
        @include bg-img('../../public/img/star24_off',12px 12px);
      }
    }
  }
</style>
