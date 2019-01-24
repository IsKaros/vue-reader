<template>
  <div class="search-result">
    <CommonHeader :title="setTitle"></CommonHeader>
    <Books :booksList="books" ></Books>
    <div class="noMore">没有更多的书籍了</div>
  </div>
</template>
<script>
  import {Search} from '../../api/api'
  import Books from '../../common/Books'
  import CommonHeader from '../../common/CommonHeader'
  import {Indicator} from 'mint-ui'

  export default {
    name: 'Search-Detail',
    data() {
      return {
        title: '',
        books: []
      }
    },
    created() {
      this.title = this.$route.query.val
      this.getSearchResult(this.$route.query.val)
    },
    computed: {
      setTitle() {
        return `与"${this.title}"相关的书籍`
      }
    },
    methods: {
      getSearchResult(key) {
        Indicator.open('加载中...')
        Search(key).then(res => {
          if (res.data.ok) {
            console.log(res.data)
            this.books = this.getDesc(this.getCover(this.initializeBooks(res.data.books)))
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
      getCover(arr) {
        for (let i in arr) {
          arr[i].cover = decodeURIComponent(arr[i].cover)
          arr[i].cover = arr[i].cover.replace('/agent/', '')
        }
        return arr
      },
      getDesc(arr) {
        for (let i in arr) {
          arr[i].shortIntro = arr[i].shortIntro.replace(/\\n/, '')
        }
        return arr
      }
    },
    components: {
      Books,
      CommonHeader
    }
  }
</script>
<style lang="scss" scoped>
  .search-result {
    .noMore {
      width: 100%;
      height: 6vh;
      line-height: 6vh;
      font-size: 14px;
      text-align: center;
      color: #999;
    }
  }
</style>
