<template>
  <div class="list-detail">
    <CommonHeader :title="headerTitle"></CommonHeader>
      <div class="author">
        <img :src="author.avatar" alt="" class="avatar">
        <div class="author-info">
          <span class="name">{{author.nickname}}&nbsp;lv{{author.lv}}</span>
          <div class="last-time">{{formatingTime}}</div>
        </div>
      </div>
     <div class="upload-desc">
       <h1 class="title">{{title}}</h1>
       <div class="desc">{{desc}}</div>
     </div>
    <div class="created">
      <img :src="author.avatar" alt="" class="avatar">
      <span class="create">创建自
        <span class="name">{{author.nickname}}</span>
      </span>
    </div>
    <div class="books">
      <ul>
        <li class="book" v-for="(item,index) in books" :key="index" @click="goBookDetail(item.book._id)">
          <div class="description">
            <img :src="item.book.cover" alt="" class="cover">
            <div class="desc">
              <h3 class="title">{{item.book.title}}</h3>
              <div class="book-data">
                <span>{{item.book.author}}</span>
                <span>|</span>
                <span>{{item.book.cat}}</span>
                <span>|</span>
                <span class="follwer">{{item.book.latelyFollower}}</span>
                <span>人气</span>
              </div>
            </div>
          </div>
          <div class="comment">{{item.comment}}</div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import {bookListsInfo} from '../../api/api'
  import CommonHeader from '../../common/CommonHeader'
  export default {
    name: 'List-Detail',
    data() {
      return {
        author: [],
        books: [],
        updated: 0,
        title: '',
        desc: '',
        headerTitle: '书单详情'
      }
    },
    created() {
      console.log(this.$route.params)
      this.getBookListsInfo(this.$route.params.id)
    },
    computed: {
      formatingTime() {
        let currentTime = Math.round(new Date() / 1000)
        let dataTime = Math.round(new Date(this.updated) / 1000)
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
      }
    },
    methods: {
      getBookListsInfo(id) {
        bookListsInfo(id).then(res => {
          console.log(res)
          if (res.status === 200) {
            let data = res.data.bookList
            this.author = this.getAvatar(data.author)
            this.books = this.getPicture(data.books)
            this.updated = data.updated
            this.title = data.title
            this.desc = data.desc
            console.log(this.books)
          }
        })
      },
      getPicture(arr) {
        for (let i in arr) {
            arr[i].book.cover = decodeURIComponent(arr[i].book.cover)
            arr[i].book.cover = arr[i].book.cover.replace('/agent/', '')
        }
        return arr
      },
      getAvatar(obj) {
        let url = 'http://statics.zhuishushenqi.com'
        obj.avatar = url + obj.avatar
        return obj
      },
      goBookDetail(id) {
        this.$router.push({name: 'book_detail', params: {id: id}})
      }
    },
    components: {
      CommonHeader
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../public/scss/mixin";
  @import "../../public/scss/variable";
  .list-detail {
    font-size: 0;
    background-color: #f5f2ed;
    .author {
      display: flex;
      padding: 2.25vh 4vw 0 2.25vh;
      background-color: #fff;
      .avatar {
        width: 9.33vw;
        height: 5.25vh;
      }
      .author-info {
        flex: 1;
        margin-left: 2vw;
        font-size: 12px;
        .name {
          line-height: 2.59vh;
          color: #d47e6e;
        }
        .last-time {
          color: #999;
          line-height: 2.59vh;
        }
      }
    }
    .upload-desc {
      padding: 2.25vh 4vw;
      font-size: 12px;
      background-color: #fff;
      .title {
        margin-bottom: 2.25vh;
      }
      .desc {
        line-height: 2.87vh;
        color: #999;
      }
    }
    .created {
      padding: 0 4vw 2.25vh 4vw;
      background-color: #fff;
      @include border-b-1px(#edebe9);
      .avatar {
        width: 8vw;
        height: 4.5vh;
        border-radius: 50%;
        vertical-align: middle;
      }
      .create {
        margin-left: 2vw;
        font-size: 12px;
        color: #666;
        .name {
          color: #d47e6e;
        }
      }
    }
    .books {
      .book {
        margin: 1.5vh 0 0.75vh 0;
        padding: 2.25vh 4vw;
        background-color: #fff;
        .description {
          display: flex;
          margin-bottom: 2.25vh;
          .cover {
            width: 11.51vw;
            height: 7.83vh;
          }
          .desc {
            display: flex;
            flex-direction: column;
            flex: 1;
            margin-left: 4vw;
            line-height: 4vh;
            font-size: 12px;
            .title {
              flex: 1;
              font-size: 12px;
              color: #222;
            }
            .book-data {
              flex: 1;
              color: #999;
              span {
                margin: 0 1vw;
              }
              .follwer {
                color: $color-theme;
              }
            }
          }
        }
        .comment {
          padding: 2.25vh 0;
          line-height: 2.85vh;
          font-size: 12px;
          color: #999;
          @include border-t-1px(#f2f2f2)
        }
      }
    }

  }
</style>
