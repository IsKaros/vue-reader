<template>
  <div class="catalog">
    <div class="topBar">
      <div class="title">{{bookName}}</div>
      <div class="desc">目录</div>
    </div>
    <div class="chapters" ref="chapters">
      <ul>
        <li v-for="(item,index) in chapters" :key="index" class="chapter" :class="{current:index==currentChapter}" @click="changeChapter(index)">
          <p>{{index+1}}-{{item}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import BScroll from 'better-scroll'

  export default {
    name: 'Catalog',
    props: {
      chapters: {
        type: Array,
        required: true
      },
      bookName: {
        type: String,
        required: true
      },
      currentChapter: {
        type: Number,
        required: true
      },
      showCatalog: {
        type: Boolean,
        required: true
      }
    },
    // 计算属性不能做赋值操作,执行该函数无效
    // computed: {
    //   showCata() {
    //     let isshow = this.showCatalog
    //     if (isshow === true) {
    //       this._initScroller()
    //     }
    //     return this.isshow
    //   }
    // },
    watch: {
      showCatalog(newValue, oldValue) {
        if (newValue === true) {
          this._initScroller()
        }
      }
    },
    methods: {
      _initScroller() {
        // 坑：注意,如果该滚动元素一开始就是隐藏的，则实例化BScroll 会无法滚动，此时外层和内层的高度都显示为零
        this.$nextTick(() => {
            if (!this.chapterScroller) {
              this.$refs.chapters.style.height = '87.47vh'
              console.log(this.$refs.chapters)
              this.chapterScroller = new BScroll(this.$refs.chapters, {
                click: true
              })
            } else {
              this.chapterScroller.refresh()
            }
        })
      },
      changeChapter(chapter) {
        this.$emit('changeChapter', chapter)
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../public/scss/mixin";
  @import "../../public/scss/variable";

  .catalog {
    position: absolute;
    z-index: 20;
    left: 0;
    top: 0;
    width: 78.4vw;
    height: 100%;
    background-color: #fff;
    .topBar {
      padding-left: 5.3vw;
      padding-bottom: 2vh;
      @include border-b-1px(#f2f2f2);
      .title {
        font-size: 20px;
        padding: 2.25vh 0 3vh;
      }
      .desc {
        height: 2.53vh;
        line-height: 2.63vh;
        font-size: 16px;
        color: #999;
      }
    }
    .chapters {
      width: 100%;
      height: 87.47vh;
      overflow: hidden;
      .chapter {
        height: 7.48vh;
        line-height: 7.48vh;
        margin-left: 5.33vw;
        padding-right: 9.33vw;
        font-size: 12px;
        color: #999;
        @include border-b-1px(#f2f2f2);
        &.current {
          color: $color-theme;
        }
      }
    }
  }
</style>
