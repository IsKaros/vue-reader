<template>
  <div class="books-detail" ref="detail">
    <CommonHeader :title="title"></CommonHeader>
    <div class="books-content">
      <div class="books-info">
        <img :src="book.cover" alt="" class="cover">
        <div class="desc">
          <div class="title">
            {{book.title}}
          </div>
          <div class="info">
            <span class="author">{{book.author}}</span>
            <span class="split"> | </span>
            <span class="cate">{{book.minorCate}}</span>
            <span class="split"> | </span>
            <span class="word">{{wordCount}}</span>
          </div>
          <div class="update">
            {{update}}
          </div>
        </div>
      </div>
      <div class="read">
        <div class="add-book" @click="toggleBook">{{shelfText}}</div>
        <div class="start-read" @click="goRead">开始阅读</div>
      </div>
    </div>
    <div class="reader-data">
      <div class="follower">
        <span class="text">追人气</span>
        <span class="data">{{latelyFollower}}</span>
      </div>
      <div class="retention-ratio">
        <span class="text">读者留存率</span>
        <span class="data">{{book.retentionRatio}}%</span>
      </div>
      <div class="update-count">
        <span class="text">日更新字数/天</span>
        <span class="data">{{book.serializeWordCount}}</span>
      </div>
    </div>
    <div class="introduction">
      <p class="text">{{book.longIntro}}</p>
    </div>
    <div class="chapter">
      <span>目录</span>
      <div class="chapter-info">
        <span class="info">[{{update}}]&nbsp;{{book.lastChapter}}</span>
      </div>
    </div>
    <Comments :id="$route.params.id"></Comments>
  </div>
</template>
<script>
  import {book} from '../api/api'
  import {mapMutations, mapState} from 'vuex'
  import Comments from '../components/comments/Comments'
  import CommonHeader from './CommonHeader'

  export default {
    name: 'BooksDetail',
    data() {
      return {
        book: [],
        update: 0,
        isAdd: false,
        title: '书籍详情'
      }
    },
    created() {
      this.getBook()
    },
    computed: {
      ...mapState(['bookShelf']),
      wordCount() {
        let result = this.book.wordCount
        if (result >= 1000 && result < 10000) {
          return `${(result / 1000).toFixed(1)}千字`
        } else if (result >= 10000 && result < 10000000) {
          return `${(result / 10000).toFixed(1)}万字`
        }
      },
      latelyFollower() {
        let result = this.book.latelyFollower
        if (result >= 1000 && result < 10000) {
          return `${(result / 1000).toFixed(2)}千`
        } else if (result >= 10000 && result < 10000000) {
          return `${(result / 10000).toFixed(2)}万`
        }
      },
      shelfText() {
        console.log(this.bookShelf)
        for (let i in this.bookShelf) {
          if (this.bookShelf[i].title === this.book.title) {
            return '撤出书架'
          } else {
            return '加入书架'
          }
        }
      }
    },
    methods: {
      ...mapMutations(['ADD_BOOKSHELF', 'REMOVE_BOOKSHELF']),
      getBook() {
        book(this.$route.params.id).then(res => {
          if (res.status === 200) {
            this.book = res.data
            this.update = this.formatingTime(this.book.updated)
            this.getCover(this.book)
          }
        })
      },
      formatingTime(time) {
        let currentTime = Math.round(new Date() / 1000)
        let dataTime = Math.round(new Date(time) / 1000)
        let result = currentTime - dataTime
        if (result >= 0 && result < 60) {
          return `刚刚更新`
        } else if (result / 60 >= 1 && result / 60 < 60) {
          return `${(result / 60).toFixed(0)}分钟前更新`
        } else if (result / 3600 >= 1 && result / 3600 < 24) {
          return `${(result / 3600).toFixed(0)}小时前更新`
        } else if (result / 3600 / 24 >= 1 && result / 3600 / 24 <= 365) {
          return `${(result / 3600 / 24).toFixed(0)}天前更新`
        }
        console.log(result)
      },
      getCover(book) {
        book.cover = decodeURIComponent(book.cover)
        book.cover = book.cover.replace('/agent/', '')
      },
      goRead() {
        this.$router.push({name: 'read', params: {id: this.$route.params.id}})
      },
      toggleBook() {
        if (this.bookShelf.indexOf(this.book) !== -1) {
          this.REMOVE_BOOKSHELF(this.book)
        } else {
          this.ADD_BOOKSHELF(this.book)
          this.setBookLocalStorage()
        }
      },
      // 数据持久化之localStorage的设置
      setBookLocalStorage() {
        let localShelf = JSON.parse(window.localStorage.getItem('book')) ? JSON.parse(window.localStorage.getItem('book')) : {}
        // console.log(this.$route.params.id)
        console.log(localShelf)
        localShelf[this.$route.params.id] = {}
        localShelf[this.$route.params.id].currentChapter = 0
        window.localStorage.setItem('book', JSON.stringify(localShelf))
      }
    },
    components: {
      Comments,
      CommonHeader
    }
  }
</script>
<style lang="scss" scoped>
  @import "../public/scss/mixin";
  @import '../public/scss/variable';

  .books-detail {
    .books-content {
      @include border-b-1px(#ebebeb);
      .books-info {
        display: flex;
        padding: 3.0vh 5.3vw;
        .cover {
          width: 17.3vw;
          height: 13.1vh;
        }
        .desc {
          flex: 1;
          margin-left: 2vw;
          .title {
            margin-bottom: 1vh;
          }
          .info {
            font-size: 12px;
            color: #999;
            margin-bottom: 2vh;
            .author {
              color: #b93321;
            }
            .split {
              margin: 0 1vw;
            }
          }
          .update {
            font-size: 12px;
            color: #999;
          }
        }
      }
      .read {
        padding: 0 5.3vw 3.0vh 5.3vw;
        .add-book, .start-read {
          display: inline-block;
          width: 40vw;
          height: 6.5vh;
          text-align: center;
          line-height: 6.5vh;
        }
        .add-book {
          border: 1px solid $color-theme;
          color: $color-theme;
          margin-right: 3.5vw;
        }
        .start-read {
          color: #fff;
          background-color: $color-theme;
          margin-left: 3.5vw;
        }
      }
    }
    .reader-data {
      display: flex;
      padding: 5.3vh 0;
      @include border-b-1px(#ebebeb);
      .follower, .retention-ratio, .update-count {
        flex: 1;
        text-align: center;
        font-size: 12px;
        .text {
          display: inline-block;
          color: #999;
          width: 100%;
          margin-bottom: 2vh;
        }
        .data {
          font-size: 16px;
        }
      }
    }
    .introduction {
      padding: 3vh 5.3vw;
      line-height: 3.7vh;
      font-size: 14px;
      @include border-b-1px(#ebebeb);
      .text {
        text-overflow: ellipsis;
        word-break: break-all;
        overflow: hidden;
      }
    }
    .chapter {
      padding: 3vh 2.65vw 3vh 5.3vw;
      @include border-b-1px(#ebebeb);
      .chapter-info {
        float: right;
        font-size: 12px;
        color: #999;
        max-width: 60%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
</style>
