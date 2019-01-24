<template>
  <div class="rank">
    <Header></Header>
    <div class="male">
      <div class="male-header"><h3>男生</h3></div>
      <div class="cate-list">
        <ul>
          <li v-for="(item,index) in maleCate" :key="index" @click="goRankDetail(item._id,item.title)">
            <a href="javascript:void(0)" class="route">
              <img :src="url+item.cover" alt="" class="pic">
              <span class="text">{{item.title}}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="female">
      <div class="female-header"><h3>女生</h3></div>
      <div class="cate-list">
        <ul>
          <li v-for="(item,index) in femaleCate" :key="index" @click="goRankDetail(item._id,item.title)">
            <a href="javascript:void(0)" class="route">
              <img :src="url+item.cover" alt="" class="pic">
              <span class="text">{{item.title}}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import Header from '../header/Header'
  import {rankCategory} from '../../api/api'
  import {Indicator} from 'mint-ui'
  export default {
    name: 'Rank',
    data() {
      return {
        url: 'http://statics.zhuishushenqi.com/',
        maleCate: [],
        femaleCate: []
      }
    },
    created() {
      this.getRankCategory()
    },
    components: {
      Header
    },
    methods: {
      getRankCategory() {
        Indicator.open('加载中...')
        rankCategory().then(res => {
          console.log(res.data)
          if (res.data.ok) {
            this.maleCate = res.data.male.slice(0, 7)
            this.femaleCate = res.data.female.slice(0, 6)
            Indicator.close()
          }
        }, error => {
          Indicator.close()
          Indicator.open('加载失败,请检查网络')
          console.log(error)
          setTimeout(() => {
            Indicator.close()
          }, 1500)
        })
      },
      goRankDetail(id, title) {
        this.$router.push({name: 'rank-detail', params: {id: id, title: title}})
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../public/scss/mixin";
  .rank {
    .male {
      .male-header {
        padding: 1.54vh 0 0 4vw;
        width: 100%;
        color: #999;
        background-color: #e6e6e6;
        h3 {
          height: 8.1vh;
          line-height: 6.6vh;
        }
      }
      .cate-list {
        .route {
          display: inline-block;
          width: 100%;
          height: 9.0vh;
          .pic {
            width: 7.99vw;
            height: 4.5vh;
            padding: 2.24vh 0 0 4vw;

          }
          .text {
            display: inline-block;
            width: 85.33vw;
            height: 100%;
            color: #333;
            vertical-align: top;
            line-height: 9.0vh;
            margin-left: 1vw;
            @include border-b-1px(#ebebeb)
          }
        }
      }
    }
    .female {
      .female-header {
        padding: 1.54vh 0 0 4vw;
        width: 100%;
        color: #999;
        background-color: #e6e6e6;
        h3 {
          height: 8.1vh;
          line-height: 6.6vh;
        }
      }
      .cate-list {
        .route {
          display: inline-block;
          width: 100%;
          height: 9.0vh;
          .pic {
            width: 7.99vw;
            height: 4.5vh;
            padding: 2.24vh 0 0 4vw;

          }
          .text {
            display: inline-block;
            width: 85.33vw;
            height: 100%;
            color: #333;
            vertical-align: top;
            line-height: 9.0vh;
            margin-left: 1vw;
            @include border-b-1px(#ebebeb)
          }
        }
      }
    }
  }
</style>
