<template>
  <div class="rank-detail">
    <CommonHeader :title="title"></CommonHeader>
    <div class="rankTypes">
      <ul>
        <li v-for="(item,index) in rankTypes" :key="index" class="type" :class="{active:item.name==type}"
            @click="changeRank(item)">{{item.type}}
        </li>
      </ul>
    </div>
    <Books :booksList="books" :wrapperHeight='wrapperHeight' @pullUp="pullUpLoad" @pullDown="pullDownRefresh"
           :isScroll="true"></Books>
  </div>
</template>
<script>
  import {rank} from '../../api/api'
  import {Indicator} from 'mint-ui'
  import Books from '../../common/Books'
  import CommonHeader from '../../common/CommonHeader'

  export default {
    name: 'Ranking-Detail',
    data() {
      return {
        rankTypes: [{
          type: '周榜',
          name: 'week'
        }, {type: '月榜', name: 'month'}, {type: '总榜', name: 'total'}],
        type: 'week',
        books: [],
        title: '',
        weekRank: '',
        monthRank: '',
        totalRank: '',
        rankingData: {},
        currentPage: 1,
        wrapperHeight: '85.3'
      }
    },
    created() {
      this.title = this.$route.params.title
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.getRank()
      })
    },
    methods: {
      getRank(id) {
        Indicator.open('加载中...')
        if (!this.weekRank) {
          rank(this.$route.params.id).then(res => {
            console.log(res)
            if (res.status === 200) {
              let data = res.data.ranking
              this.rankingData = data
              this.weekRank = data.id
              this.monthRank = data.monthRank
              this.totalRank = data.totalRank
              this.title = data.title
              this.books = this.initializeBooks(this.getCover((data.books).slice(0, 20)))
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
        }
        rank(id).then(res => {
          console.log(res)
          if (res.data.ok) {
            let data = res.data
            this.books = this.getCover((data.ranking.books).slice(0, 20))
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
      // 获取每张解码后的封面
      getCover(arr) {
        for (let i in arr) {
          arr[i].cover = decodeURIComponent(arr[i].cover)
          arr[i].cover = arr[i].cover.replace('/agent/', '')
        }
        return arr
      },
      // 切换榜单
      changeRank(item) {
        this.getRank(this[`${item.name}Rank`])
        this.type = item.name
      },
      pullUpLoad() {
        Indicator.open('加载中')
        rank(this[this.type + 'Rank']).then(res => {
          console.log(res)
          if (res.data.ok) {
            if (this.books.length === res.data.ranking.books.length) {
              Indicator.close()
              return
            }
            let data = res.data
            let books = this.getCover((data.ranking.books).slice(this.currentPage * 20, (this.currentPage + 1) * 20))
            for (let i in books) {
              this.books.push(books[i])
            }
            console.log(this.books.length)
            this.currentPage++
            setTimeout(() => {
              Indicator.close()
            }, 350)
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
      pullDownRefresh() {
        Indicator.open('加载中')
        rank(this[this.type + 'Rank']).then(res => {
          if (res.data.ok) {
            let data = res.data
            this.books = this.getCover((data.ranking.books).slice(0, this.currentPage * 20))
            setTimeout(() => {
              Indicator.close()
            }, 350)
          }
        }, error => {
          Indicator.close()
          console.log(error)
          Indicator.open('加载失败,请检查网络')
          setTimeout(() => {
            Indicator.close()
          }, 1500)
        })
      }

    },
    components: {
      Books,
      CommonHeader
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../public/scss/variable";

  .rank-detail {
    font-size: 0;
    background-color: #f5f2ed;

    .rankTypes {
      width: 100%;
      height: 8.1vh;
      font-size: 14px;
      color: #666;
      background-color: #fff;
      .type {
        display: inline-block;
        width: 33.33333333%;
        height: 100%;
        line-height: 8.1vh;
        text-align: center;
        color: #999;
        &.active {
          border-bottom: 2px solid $color-theme;
        }
      }
    }
    .books {
    }
  }
</style>
