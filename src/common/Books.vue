<template>
  <div class="books" ref="books">
    <ul>
      <li v-for="(item,i) in booksList" :key="i" @click="goDetail(item.id)" ref="bookItems">
        <div class="book">
          <div class="cover">
            <img :src="item.cover" alt="">
          </div>
          <div class="detail">
            <h4 class="name">{{item.title}}</h4>
            <h4 class="author">{{item.author}}</h4>
            <h4 class="intro">{{item.shortIntro}}</h4>
            <div class="cate">
              <span class="popularity">{{item.latelyFollower|filterNum}}</span>人气
              <span class="split">|</span>
              <span class="retentionRatio">{{item.retentionRatio}}%</span>读者留存
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
  import BScroll from 'better-scroll'

  export default {
    name: 'Result',
    props: {
      booksList: {
        type: Array,
        required: true
      },
      isScroll: {
        type: Boolean,
        default: false
      },
      wrapperHeight: {
        type: String
      },
      isOnScroll: {
        type: Boolean,
        default: false
      },
      showBrief: {
        type: Boolean,
        default: false
      }
    },
    filters: {
      filterNum(num) {
        if (num >= 10000) {
          return `${(num / 10000).toFixed(2)}万`
        } else if (num < 10000) {
          return `${num}万`
        }
      }
    },
    updated() {
      if (this.isScroll) {
        this._initScroller()
      }
    },
    watch: {
      showBrief(newValue, oldValue) {
        if (newValue === true) {
          console.log(newValue)
          this.$refs.books.style.marginTop = '6.75vh'
          this.$refs.books.style.height = '86.65vh'
          console.log(this.$refs.books.style.height)
        } else {
          this.$refs.books.style.marginTop = ''
          this.$refs.books.style.height = this.wrapperHeight + 'vh'
        }
      }
    },
    methods: {
      goDetail(id) {
        this.$router.push({name: 'book_detail', params: {id: id}})
      },
      _initScroller() {
        this.$nextTick(() => {
          if (!this.bookScroller) {
            this.$refs.books.style.height = this.wrapperHeight + 'vh'
            this.bookScroller = new BScroll(this.$refs.books, {
              click: true,
              probeType: 2,
              pullUpLoad: {
                threshold: 50
              },
              pullDownRefresh: {
                threshold: 50,
                stop: 20
              }
            })
          }
          this.bookScroller.on('pullingUp', () => {
            this.$emit('pullUp')
            this.bookScroller.refresh()
            this.bookScroller.finishPullUp()
          })
          this.bookScroller.on('pullingDown', () => {
            this.$emit('pullDown')
            this.bookScroller.refresh()
            this.bookScroller.finishPullDown()
          })
          if (this.isOnScroll) {
            this.bookScroller.on('scroll', this.Scroll)
          }
        })
      },
      Scroll(pos) {
        // console.log(parseInt(Math.abs(pos.y)))
        let y = parseInt(Math.abs(pos.y))
        this.$emit('scroll', y)
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../public/scss/variable";

  .books {
    overflow: hidden;
    background-color: #f5f2ed;
    .book {
      display: flex;
      padding: 2.25vh 4vw;
      .cover {
        flex: 0 0 16.666vw;
        /*padding: 0vh 2vw 2vh 2vw;*/
        img {
          width: 16.666vw;
        }
      }
      .detail {
        flex: 1;
        width: 100%;
        overflow: hidden;
        padding: 0 2vw;
        .name {
          font-size: 14px;
          padding: 4px 0;
        }
        .author {
          font-size: 12px;
          color: #d47e6e;
          padding: 5px 0;
        }
        .intro {
          font-size: 12px;
          padding: 5px 0;

          margin-bottom: 1.5vh;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          color: #999;
        }
        .cate {
          font-size: 12px;
          color: #666;
          .popularity {
            color: $color-theme;
          }
          .split {
            padding: 0 2vw;
          }
          .major-cate {
            float: right;
            color: #e78f8f;
            padding: 1px;
            border: 1px solid #e78f8f;
            border-radius: 1px;
          }
          .retentionRatio {
            color: $color-theme;
          }
        }
      }
    }
  }
</style>
