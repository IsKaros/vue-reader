<template>
  <div class="search">
    <CommonHeader :title="title"></CommonHeader>
    <div class="search-body">
      <div class="search-wrapper">
        <span class="icon icon-search"></span>
        <input type="search" class="search" :placeholder=placeHolder @input="searchChange" v-model="val" ref="search">
      </div>
      <span class="confirm" @click="confirm">确定</span>
    </div>
    <div class="related" v-show="val">
      <ul>
        <li v-for="(item,index) in books" :key="index" class="item" @click="goSearchResult(item.title)">
          <span class="icon icon-book"></span>
          <span class="title">{{item.title}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import {Search} from '../../api/api'
  import CommonHeader from '../../common/CommonHeader'
  export default {
    name: 'Search',
    data() {
      return {
        placeHolder: '请输入搜索内容',
        books: [],
        val: '',
        title: '搜索'
      }
    },
    methods: {
      searchChange($event) {
        let reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/g
        if (reg.test($event.target.value)) {
            this.getSearch($event.target.value)
        }
      },
      getSearch(key) {
        Search(key).then(res => {
          console.log(res.data)
          if (res.data.ok) {
            let relatedBooks = res.data.books
            relatedBooks = relatedBooks.filter((book) => {
              return book.title.indexOf(key) === 0
            })
            if (this.books !== []) {
              this.books = []
            }
            for (let i in relatedBooks) {
              this.books.push({title: relatedBooks[i].title})
            }
            console.log(this.books)
          }
          this.sortByFollwer(this.books, 'latelyFollwer')
        })
      },
      sortByFollwer(arr, key) {
        arr.sort((a, b) => {
          let x = a[key]
          let y = b[key]
          return ((x > y) ? 1 : (x < y) ? -1 : 0)
        })
      },
      goSearchResult(val) {
        this.$router.push({path: '/search/search-result', query: {val: val}})
      },
      confirm() {
        this.$router.push({path: '/search/search-result', query: {val: this.$refs.search.value}})
      }
    },
    components: {
      CommonHeader
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../public/scss/variable";

  .search {
    font-size: 0;
    .search-body {
      padding: 2.25vh 4vw 0 4vw;
      .search-wrapper {
        display: inline-block;
        width: 64vw;
        height: 5.24vh;
        line-height: 5.24vh;
        padding: 0 6vw;
        margin-bottom: 3vh;
        background-color: #ebebf0;
        border-radius: 6%;
        vertical-align: center;
        .icon {
          line-height: 5.24vh;
          font-size: 16px;
        }
        .search {
          width: 90%;
          height: 2.0vh;
          margin-left: 2vw;
          font-size: 14px;
          background-color: #ebebf0;
          color: #222;
        }
      }
      .confirm {
        margin-left: 2vw;
        font-size: 20px;
      }

    }
    .related {
      padding: 0 4vw;
      font-size: 16px;
      .item {
        height: 7.8vh;
        line-height: 7.8vh;
        .icon {
          font-size: 12px;
          color: #999;
        }
        .title {
          margin-left: 2vw;
        }
      }
    }
  }
</style>
