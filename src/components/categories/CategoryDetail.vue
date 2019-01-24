<template>
  <div class="category" ref="category">
    <CommonHeader :title="$route.query.major"></CommonHeader>
    <div class="brief" v-show="showBrief" @click="showBrief=!showBrief">
      <span>{{cate}}</span>
      <span>-</span>
      <span>按{{briefMinor}}</span>
    </div>
    <div class="large-cate" v-show="!showBrief">
      <ul>
        <li v-for="(item,index) in largeType" :key="index" :class="{active:item.type==type}" @click="changeLargeType">
          {{item.name}}
        </li>
      </ul>
    </div>
    <div class="minor" v-show="!showBrief">
      <ul>
        <li v-for="(item,index) in minor" :key="index" :class="{active:item==cate}" @click="changeMinorType">{{item}}
        </li>
      </ul>
    </div>
    <BookList :booksList="books" :isScroll="true" :wrapperHeight="wrapperHeight"  @pullUp="pullUpLoad" :showBrief="showBrief" @pullDown="pullDownRefresh" @scroll="cateScroll" :isOnScroll="true"></BookList>
  </div>
</template>
<script>
  import {categoriesInfo, subCategories} from '../../api/api'
  import BookList from '../../common/Books'
  import CommonHeader from '../../common/CommonHeader'
  import {Indicator} from 'mint-ui'

  export default {
    name: 'category',
    data() {
      return {
        gender: '',
        major: '',
        type: 'hot',
        cate: '全部',
        largeType: [{
          type: 'hot',
          name: '热门'
        }, {
          type: 'new',
          name: '新书'
        }, {
          type: 'reputation',
          name: '好评'
        }, {
          type: 'over',
          name: '完结'
        }, {
          type: 'monthly',
          name: '包月'
        }],
        init: true,
        minor: [],
        books: [],
        currentPage: 1,
        showBrief: false,
        wrapperHeight: '79.9'
      }
    },
    computed: {
      briefMinor() {
        for (let i in this.largeType) {
          if (this.largeType[i].type === this.type) {
            return this.largeType[i].name
          }
        }
      }
    },
    created() {
      this.gender = this.$route.query.gender
      this.major = this.$route.query.major
      this.getSubCategories()
      this.getCategoriesInfo(this.$route.query.gender, this.type, this.$route.query.major)
    },
    mounted() {
      console.log(this.$refs)
      this.$nextTick(() => {
        if (this.$refs.category.onscroll) {
          this.$refs.category.removeEventListener('scroll', this.cateScroll)
          this.$refs.category.addEventListener('scroll', this.cateScroll)
        }
        this.$refs.category.addEventListener('scroll', this.cateScroll)
      })
    },
    methods: {
      getCategoriesInfo(gender, type, major, minor = '', start = 0, limit = 20) {
        Indicator.open('加载中...')
        categoriesInfo(gender, type, major, minor, start, limit).then(res => {
          if (res.status === 200) {
            console.log(res.data.books)
            let books = this.initializeBooks(this.getCover(res.data.books))
            if (this.init === true) {
              this.books = []
              this.init = false
            }
            for (let i in books) {
              this.books.push(books[i])
            }
            console.log(this.books)
            Indicator.close()
          }
        }, error => {
          Indicator.close()
          console.log(error)
          Indicator.open('加载失败,请检查网络')
          setTimeout(() => {
            Indicator.close()
          }, 1500)
        })
      },
      getSubCategories() {
        subCategories().then(res => {
          if (res.status === 200) {
            let data = res.data[this.$route.query.gender]
            for (let i in data) {
              if (this.$route.query.major === data[i].major) {
                this.minor = data[i].mins
                this.minor.unshift('全部')
              }
            }
          }
        })
      },
      getCover(arr) {
        for (let i in arr) {
          arr[i].cover = decodeURIComponent(arr[i].cover)
          arr[i].cover = arr[i].cover.replace('/agent/', '')
        }
        return arr
      },
      changeLargeType($event) {
        console.log($event)
        this.init = true
        for (let i in this.largeType) {
          if ($event.target.textContent.trim() === this.largeType[i].name) {
            this.type = this.largeType[i].type
            console.log(this.type)
            break
          }
        }
        this.getCategoriesInfo(this.gender, this.type, this.major)
      },
      changeMinorType($event) {
        this.init = true
        this.cate = $event.target.textContent.trim()
        console.log(this.cate)
        if (this.cate === '全部') {
          this.getCategoriesInfo(this.gender, this.type, this.major)
        } else {
          this.getCategoriesInfo(this.gender, this.type, this.major, this.cate)
        }
      },
      pullUpLoad() {
        this.currentPage++
        if (this.cate === '全部') {
          this.getCategoriesInfo(this.gender, this.type, this.major, '', this.currentPage * 20)
        } else {
          this.getCategoriesInfo(this.gender, this.type, this.major, this.cate, this.currentPage * 20)
        }
      },
      pullDownRefresh() {
        this.init = true
        if (this.cate === '全部') {
          this.getCategoriesInfo(this.gender, this.type, this.major)
        } else {
          this.getCategoriesInfo(this.gender, this.type, this.major, this.cate)
        }
      },
      cateScroll(y) {
        if (y >= 108) {
          this.showBrief = true
        } else {
          this.showBrief = false
        }
      }
    },
    components: {
      BookList,
      CommonHeader
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../public/scss/mixin";
  @import "../../public/scss/variable";

  .category {
    /*display: flex;*/
    .brief {
      position: absolute;
      z-index: 10;
      left: 0;
      top: 6.6vh;
      width: 100%;
      height: 6.75vh;
      font-size: 12px;
      line-height: 6.75vh;
      text-align: center;
      color: #999;
      background-color: #fff;
    }
    .large-cate {
      height: 6.75vh;
      @include border-b-1px(#eee);
      li {
        display: inline-block;
        height: 6.75vh;
        width: 7vw;
        padding: 0 2.67vw 0 4vw;
        font-size: 14px;
        line-height: 6.75vh;
        text-align: center;
        color: #666;
        &.active {
          color: $color-theme;
        }
      }
    }
    .minor {
      height: 6.75vh;
      overflow: auto;
      li {
        display: inline-block;
        height: 6.75vh;
        padding: 0 2.67vw 0 4vw;
        font-size: 14px;
        line-height: 6.75vh;
        text-align: center;
        color: #666;
        &.active {
          color: $color-theme;
        }
      }
    }
  }
</style>
