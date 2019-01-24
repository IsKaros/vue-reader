<template>
  <div class="books">
    <ul>
      <li v-for="(item,i) in booksList" :key="i" @click="goDetail(item.id)">
        <div class="book">
          <div class="cover">
            <img :src="item.cover" alt="">
          </div>
          <div class="detail">
            <h4 class="name">{{item.title}}</h4>
            <h4 class="author">{{item.author}}</h4>
            <h4 class="intro">{{item.shortIntro}}</h4>
            <div class="cate">
              {{item.minorCate}}
              <span class="split">|</span>
              <span class="popularity">{{item.latelyFollower|filterNum}}</span>人气
              <span class="major-cate">{{item.majorCate}}</span>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    name: 'Books',
    props: {
      booksList: {
        type: Array,
        required: true
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
    methods: {
      goDetail(id) {
        this.$router.push({name: 'book_detail', params: {id: id}})
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../public/scss/mixin";
  @import "../../public/scss/variable";
  .books {
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
          .split {
            padding: 0 1vw;
          }
          .popularity{
            color: $color-theme;
          }
          .major-cate {
            float: right;
            color: #e78f8f;
            padding: 1px;
            border: 1px solid #e78f8f;
            border-radius: 1px;
          }
        }
      }
    }
  }
</style>
