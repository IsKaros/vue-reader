<template>
  <div class="books-list" ref="list">
    <CommonHeader :fixed="fixed" :title="title"></CommonHeader>
    <div class="largeTypes" v-show="!showBrief">
      <ul>
        <li v-for="(item,index) in largeTypes" :key="index" :class="{active:item.duration==duration&&item.type==type}" @click="changeLargeType">{{item.name}}</li>
      </ul>
    </div>
    <div class="minors" v-show="!showBrief">
      <ul>
        <li v-for="(item,index) in minors" :key="index" :class="{active:item.minor==minor}" @click="changeMinor">{{item.name}}</li>
      </ul>
    </div>
    <div class="brief" v-show="showBrief" @click="showBrief=false">
      <span>{{briefMinor}}</span>
      <span>-</span>
      <span>按{{briefType}}</span>
      <span class="icon-chevron-down"></span>
    </div>
    <div class="list-detail" >
      <ul>
        <li v-for="(item,index) in list" :key="index" class="list" @click="goListDetail(item.id)">
          <img :src="item.cover" alt="" class="picture">
          <div class="list-info">
            <h4 class="title">{{item.title}}</h4>
            <div class="author">{{item.author}}</div>
            <p class="desc">{{item.desc}}</p>
            <span class="book-count">共{{item.bookCount}}本书</span>
            <span class="split">|</span>
            <span class="collect-count">{{item.collectorCount}}人收藏</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import {bookLists} from '../../api/api'
  import {Indicator} from 'mint-ui'
  import CommonHeader from '../../common/CommonHeader'
  export default {
    name: 'Books-List',
    data() {
      return {
        type: 'collectorCount',
        gender: '',
        minor: '',
        duration: 'last-seven-days',
        start: 0,
        largeTypes: [
          {
            type: 'collectorCount',
            name: '本周最热',
            duration: 'last-seven-days'
          },
          {
            type: 'created',
            name: '最新发布',
            duration: 'all'
          },
          {
            type: 'collectorCount',
            name: '最多收藏',
            duration: 'all'
          }
        ],
        minors: [
          {
            minor: '',
            name: '全部'
          },
          {
            minor: 'male',
            name: '男生'
          },
          {
            minor: 'female',
            name: '女生'
          }
        ],
        list: [],
        showBrief: false,
        fixed: true,
        title: '主题书单'
      }
    },
    computed: {
      briefType() {
        for (let i in this.largeTypes) {
          if (this.type === this.largeTypes[i].type) {
            return this.largeTypes[i].name
          }
        }
      },
      briefMinor() {
        for (let i in this.minors) {
          if (this.minor === this.minors[i].minor) {
            return this.minors[i].name
          }
        }
      }
    },
    created() {
      this.getBookLists(this.type, this.duration, this.start, this.gender)
    },
    mounted() {
      window.addEventListener('scroll', this.setTab)
    },
    methods: {
      getBookLists(type, duration, start, gender) {
        Indicator.open('加载中...')
        bookLists(type, duration, start, gender).then(res => {
          console.log(res)
          if (res.status === 200) {
            let data = res.data.bookLists
            this.list = this.getExtraData(this.initializeBooks(this.getCover(data)), data)
            console.log(this.list)
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
      getExtraData(result, source) {
        for (let i in source) {
          result[i].desc = source[i].desc
          result[i].bookCount = source[i].bookCount
          result[i].collectorCount = source[i].collectorCount
        }
        return result
      },
      changeLargeType($event) {
        console.log($event)
        let text = $event.target.textContent.trim()
        for (let i in this.largeTypes) {
          if (this.largeTypes[i].name === text) {
            this.type = this.largeTypes[i].type
            this.duration = this.largeTypes[i].duration
            break
          }
        }
        this.getBookLists(this.type, this.duration, this.start, this.gender)
      },
      changeMinor($event) {
        let text = $event.target.textContent.trim()
        for (let i in this.minors) {
          if (this.minors[i].name === text) {
            this.gender = '&gender=' + this.minors[i].minor
            this.minor = this.minors[i].minor
            break
          }
        }
        console.log(this.gender)
        this.getBookLists(this.type, this.duration, this.start, this.gender)
      },
      setTab() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        if (scrollTop >= window.innerHeight * 16 / 100) {
            this.showBrief = true
        } else {
          this.showBrief = false
        }
      },
      goListDetail(id) {
        this.$router.push({name: 'list-detail', params: {id: id}})
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
  .books-list {

    .largeTypes {
      position: fixed;
      left: 0;
      top: 6.6vh;
      height: 6.75vh;
      /*margin-top: 6.6vh;*/
      width: 100%;
      font-size: 14px;
      border-bottom: 1px solid #f9f9f9;
      background-color: #fff;
      li {
        display: inline-block;
        height: 6.75vh;
        line-height: 6.75vh;
        padding: 0 2.67vw;
        color: #666;
        &:first-child {
          padding-left: 4vw;
        }
        &.active {
          color: $color-theme;
        }
      }
    }
    .minors {
      position: fixed;
      left: 0;
      top: 13.35vh;
      width: 100%;
      height: 6.75vh;
      font-size: 14px;
      border-top: 1px solid #ececec;
      background-color: #fff;
      li {
        display: inline-block;
        height: 6.75vh;
        line-height: 6.75vh;
        padding: 0 2.67vw;
        color: #666;
        &:first-child {
          padding-left: 4vw;
        }
        &.active {
          color: $color-theme;
        }

      }
    }
    .brief {
      position: fixed;
      left: 0;
      top: 6.6vh;
      width: 100%;
      height: 6.75vh;
      line-height: 6.75vh;
      font-size: 12px;
      text-align: center;
      background-color: #fff;
      color: #666;
    }
    .list-detail {
      padding: 0 4vw;
      margin-top: 20vh;
      background-color: #f5f2ed;
      .list {
        display: flex;
        padding: 2.25vh 0;
        .picture {
          width: 15.51vw;
          height: 11.64vh;
        }
        .list-info {
          flex: 1;
          margin-left: 4vw;
          overflow: hidden;
          .title {
            height: 3vh;
            font-size: 14px;
            font-weight: 700;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
          .author {
            height: 3vh;
            line-height: 3vh;
            font-size: 12px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            color: #999;
          }
          .desc {
            height: 3vh;
            line-height: 3vh;
            font-size: 12px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            color: #999;
          }
          .book-count,
          .collect-count {
            height: 3vh;
            line-height: 3vh;
            font-size: 12px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            color: #666;
          }
          .split {
            margin: 0 1vw;
            font-size: 12px;
            color: #666;
          }
        }
      }
    }
  }
</style>
