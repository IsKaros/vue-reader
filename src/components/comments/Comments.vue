<template>
  <div class="comments">
    <div class="comments-top">
      <h2 class="hot">热门书评</h2>
      <span class="more">更多评论</span>
    </div>
    <ul>
      <li v-for="(item,i) in comments" :key="i" class="comments-item">
        <div class="avatar-wrapper">
          <img :src="item.author.avatar" alt="" class="avatar">
        </div>
        <div class="comment">
          <div class="name">
            {{item.author.nickname}}
          </div>
          <div class="title">{{item.title}}</div>
          <Star :score="item.rating"></Star>
          <div class="content">{{item.content}}</div>
          <span class="time">{{item.created | comments}}</span>
          <span class="helpful">{{item.helpful.yes}}人觉得有用</span>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
  import {BookComments} from '../../api/api'
  import Star from '../star/Star'

  export default {
    name: 'Comments',
    props: {
      id: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        comments: []
      }
    },
    computed: {},
    filters: {
      comments(time) {
        let currentTime = Math.round(new Date() / 1000)
        let dataTime = Math.round(new Date(time) / 1000)
        let result = currentTime - dataTime
        if (result >= 0 && result < 60) {
          return `刚刚`
        } else if (result / 60 >= 1 && result / 60 < 60) {
          return `${(result / 60).toFixed(1)}分钟前`
        } else if (result / 3600 >= 1 && result / 3600 < 24) {
          return `${(result / 3600).toFixed(1)}小时前`
        } else if (result / 3600 / 24 >= 1 && result / 3600 / 24 <= 365) {
          return `${(result / 3600 / 24).toFixed(1)}天前`
        } else if (result / 3600 / 24 / 365 >= 1) {
          return `${(result / 3600 / 24 / 365).toFixed(0)}年前`
        }
        console.log(result)
      }
    },
    created() {
      this.getBookComments()
    },
    methods: {
      // 根据评论的'helpful'属性进行排序
      sortComments(array, key1, key2) {
        return array.sort((a, b) => {
          let x = a[key1][key2]
          let y = b[key1][key2]
          return ((x < y) ? 1 : ((x > y) ? -1 : 0))
        })
      },
      // 补全所有的评论者的头像的url地址
      getAvatar(array) {
        for (let i in array) {
          let url = 'http://statics.zhuishushenqi.com'
          array[i].author.avatar = url + array[i].author.avatar
        }
      },
      getBookComments() {
        BookComments(this.id).then(res => {
          if (res.data.ok) {
            this.comments = res.data.reviews
            this.sortComments(this.comments, 'helpful', 'yes')
            this.comments = res.data.reviews.slice(0, 5)
            this.getAvatar(this.comments)
            console.log(this.comments)
          }
        })
      }
    },
    components: {
      Star
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../public/scss/mixin";

  .comments {
    .comments-top {
      height: 6vh;
      padding: 0 5.3vw;
      .hot {
        float: left;
        line-height: 6vh;
      }
      .more {
        float: right;
        line-height: 6vh;
        font-size: 12px;
        color: #999;

      }
    }
    .comments-item {
      display: flex;
      margin: 1vh 5.3vw;
      @include border-b-1px(#ebebeb);
      .avatar-wrapper {
        width: 9.3vw;
        height: 100%;
        .avatar {
          width: 9.3vw;
          border-radius: 50%;
        }
      }

      .comment {
        flex: 1;
        padding-left: 2vw;
        font-size: 12px;
        padding-bottom: 1vh;
        .name {
          color: #d47e6e;
          margin-bottom: 1vh;
        }
        .title {
          font-weight: 700;
        }
        .content {
          max-height: 6vh;
          line-height: 3vh;
          padding-bottom: 0.7vh;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          color: #999;
        }
        .time {
          color: #999;
        }
        .helpful {
          float: right;
          padding-right: 1vw;
          color: #999;
        }
      }
    }
  }
</style>
