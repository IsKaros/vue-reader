<template>
  <div class="shelf">
    <CommonHeader :title="title"></CommonHeader>
    <div class="has-book" v-show="bookShelf.length">
      <div class="top">
        <span class="count">共{{bookShelf.length}}本</span>
        <div class="right">
          <span class="normal" v-show="!showEdit" @click="showEdit=!showEdit">编辑</span>
          <span class="edit" v-show="showEdit" >
            <span class="cancel" @click="showEdit=!showEdit">取消</span>
            <span class="delete" @click="deleteBook">删除</span>
          </span>
        </div>
      </div>
      <div class="content">
        <ul>
          <li v-for="(item,index) in bookShelf" :key="index" class="book" ref="books">
            <img :src="item.cover" alt="" class="picture">
            <div class="desc">
              <h4 class="name">{{item.title}}</h4>
                <div class="read">
                  <span class="chapter">阅读到第{{item._id|getChapter}}章</span>
                  <span class="go-detail" @click="goDetail(item._id)" v-show="!showEdit"></span>
                </div>
                <input type="checkbox" class="check-box" v-show="showEdit" @click="checkEvent($event,item)">
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="noBook" v-show="!bookShelf.length">
      <div class="pic"></div>
      <p class="find-book">书架空空如也, <a href="javascript:void(0)" @click="$router.push('/home')">快去逛逛找书</a></p>
    </div>
  </div>
</template>
<script>
  import {mapState, mapMutations} from 'vuex'
  import CommonHeader from '../../common/CommonHeader'
  export default {
    name: 'BookShelf',
    data() {
      return {
        showEdit: false,
        removeList: [],
        title: '我的书架'
      }
    },
    computed: {
      ...mapState(['bookShelf'])
    },
    created() {
      console.log(this.bookShelf)
    },
    filters: {
      getChapter(id) {
        console.log(id)
        let shelf = JSON.parse(window.localStorage.getItem('book')) ? JSON.parse(window.localStorage.getItem('book')) : {}
        console.log(shelf[id])
        if (shelf[id]) {
          return shelf[id].currentChapter + 1
        } else {
          return 1
        }
      }
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        vm.getShelfLocalStorage()
      })
    },
    beforeRouteLeave(to, from, next) {
      next((vm) => {
        vm.setShelfLocalStorage()
      })
    },
    methods: {
      ...mapMutations(['REMOVE_BOOKSHELF', 'GET_BOOKSHELF']),
      goDetail(id) {
        this.$router.push({name: 'book_detail', params: {id: id}})
      },
      deleteBook() {
        for (let i in this.removeList) {
          this.REMOVE_BOOKSHELF(this.removeList[i])
        }
        console.log(this.bookShelf)
      },
      checkEvent($event, item) {
        console.log($event)
        let target = $event.target
        if (target.checked === true) {
          this.removeList.push(item)
        } else {
          this.removeList.splice(this.removeList.indexOf(item), 1)
        }
      },
      setShelfLocalStorage() {
        let book = JSON.parse(window.localStorage.getItem('book')) ? JSON.parse(window.localStorage.getItem('bookshelf')) : {}
        book.shelf = this.bookShelf
        window.localStorage.setItem('bookShelf', JSON.stringify(bookShelf))
      },
      getShelfLocalStorage() {
        let bookShelf = JSON.parse(window.localStorage.getItem('book')) ? JSON.parse(window.localStorage.getItem('book')) : {}
        this.GET_BOOKSHELF(bookShelf)
      }
    },
    components: {
      CommonHeader
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../public/scss/variable";
  @import "../../public/scss/mixin";
  .shelf {
    position: relative;
    width: 100vw;
    height: 100vh;
    background-color: #f4f4f4;
    .header {
      height: 6.6vh;
      .home-page {
        padding-right: 2vw;
      }
    }
    .has-book {
      .top {
        padding: 0 4vw;
        height: 8.25vh;
        line-height: 8.25vh;
        font-size: 12px;
        color: #999;
        .count {
          float: left;
        }
        .right {
          display: inline-block;
          float: right;
          font-size: 12px;
          .cancel {
            margin-right: 2vw;
          }
          .delete {
            margin-left: 2vw;
            color: $color-theme;
          }
        }
      }
      .content {
        position: relative;
        background-color: #fff;
        .book {
          display: flex;
          margin: 0 4vw;
          padding: 2.25vh 0;
          @include border-b-1px(#e6e6e6);
          &:last-child {
            border-bottom: none;
          }
          .picture {
            width: 15.5vw;
            height: 12.21vh;
          }
          .desc {
            flex: 1;
            display: inline-block;
            margin-left: 4vw;
            .name {
              height: 3vh;
              line-height: 3vh;
              font-size: 14px;
              font-weight: 700;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              color: #333;
            }
            .read {
              height: 3vh;
              line-height: 3vh;
              font-size: 12px;
              color: #999;
              .chapter {
              }
              .go-detail {
                display: inline-block;
                position: absolute;
                top: 3vh;
                right: 0;
                width: 13.3vw;
                height: 7.50vh;
                background: url('https://wechatapp.zhuishushenqi.com/zhuishu/images/icon/toBookDetail.png') no-repeat center center;
                background-size: 6.65vw 3.75vh;
              }

            }
            .check-box {
              position: absolute;
              width: 18px;
              height: 18px;
              top: 2.25vh;
              right: 4vw;
            }
          }
        }
      }
    }
    .noBook {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
      height: 23.97vh;
      .pic {
        width: 26.7vw;
        height: 15.0vh;
        margin: 0 auto;
        background: url('http://m.zhuishushenqi.com/image/e9df8fb0cce3.ku.png') no-repeat;
        background-size: 100%;
        background-position: 50%;
      }
      .find-book {
        height: 9vh;
        line-height: 9vh;
        font-size: 12px;
        text-align: center;
        color: #999;
        a {
          text-decoration: underline;
        }
      }
    }
  }
</style>
