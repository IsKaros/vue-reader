<template>
  <div class="home">
    <Header></Header>
    <Slider :banner="banner"></Slider>
    <div class="wrapper">
      <div class="books" v-show="maleList.length">
        <h4 class="title">男生专场</h4>
        <BooksList :booksList="maleList"></BooksList>
        <div class="title">女生专场</div>
        <BooksList :booksList="femaleList"></BooksList>
      </div>
    </div>
  </div>
</template>
<script>
  import Header from '../header/Header'
  import Slider from '../slider/Slider'
  import BooksList from '../books/HomeBooks'
  import {rank} from '../../api/api'
  import {Indicator} from 'mint-ui'
  import {mapMutations} from 'vuex'

  export default {
    name: 'Home',
    data() {
      return {
        banner: [{src: 'http://statics.zhuishushenqi.com/recommendPage/15453823686108'}, {src: 'http://statics.zhuishushenqi.com/recommendPage/15453823588110'}, {
          src: 'http://statics.zhuishushenqi.com/recommendPage/154538237741967'
        }, {src: 'http://statics.zhuishushenqi.com/recommendPage/154538239135244'}, {
          src: 'http://statics.zhuishushenqi.com/recommendPage/154348118998888'
        }],
        maleList: [],
        femaleList: []
      }
    },
    created() {
      this.getRankData()
    },
    mounted() {
      if (window.localStorage.bookShelf) {
        this.SET_BOOKSHELF(JSON.parse(window.localStorage.bookShelf))
      }
    },
    components: {
      Header,
      Slider,
      BooksList
    },
    methods: {
      ...mapMutations(['SET_BOOKSHELF']),
      getRankData() {
        Indicator.open('加载中...')
        rank('54d42d92321052167dfb75e3').then(res => {
            if (res.data.ok) {
              this.maleList = this.getCover(this.initializeBooks(res.data.ranking.books.slice(0, 5)))
              Indicator.close()
            }
          }, error => {
            Indicator.close()
            console.log(error)
            Indicator.open('网络错误')
            setTimeout(() => {
              Indicator.close()
            }, 1500)
          }
        )
        rank('54d43437d47d13ff21cad58b').then((res) => {
          if (res.data.ok) {
            this.femaleList = this.getCover(this.initializeBooks(res.data.ranking.books.slice(0, 5)))
          }
        })
      },
      getCover(arr) {
        for (let i in arr) {
          arr[i].cover = decodeURIComponent(arr[i].cover)
          arr[i].cover = arr[i].cover.replace('/agent/', '')
        }
        return arr
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '../../public/scss/index';

  .home {
    font-size: 0;
    .books {
      margin-top: 20px;
      .title {
        position: relative;
        font-size: 14px;
        font-weight: 700;
        padding-left: 2vw;
        margin-top: 1vh;
        margin-bottom: 20px;
        @include border-l-1px($color-theme);
        &::before {
          position: absolute;
          width: 100%;
          left: 0;
          top: 0;
          border-left: 2px solid $color-theme;
        }
      }
    }

  }
</style>
