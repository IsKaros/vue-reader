<template>
  <div class="categories">
    <Header></Header>
    <div class="categories-section">
      <h4 class="categories-head">男生</h4>
      <ul>
        <li v-for="(item,index) in male" :key="index" class="categories-list"
            @click="goCategories(categoryType.male.name,item)">
          <span class="name">{{item.name}}</span>
          <span class="count">{{item.bookCount}}</span>
        </li>
      </ul>
    </div>
    <div class="categories-section">
      <h4 class="categories-head" @click="goCategories">女生</h4>
      <ul>
        <li v-for="(item,index) in female" :key="index" class="categories-list"
            @click="goCategories(categoryType.female.name,item)">
          <span class="name">{{item.name}}</span>
          <span class="count">{{item.bookCount}}</span>
        </li>
      </ul>
    </div>
    <!--<div class="categories-section">-->
      <!--<h4 class="categories-head">漫画</h4>-->
      <!--<ul>-->
        <!--<li v-for="(item,index) in manga" :key="index" class="categories-list" @click="goCategories">-->
          <!--<span class="name">{{item.name}}</span>-->
          <!--<span class="count">{{item.bookCount}}</span>-->
        <!--</li>-->
      <!--</ul>-->
    <!--</div>-->
    <!--<div class="categories-section">-->
      <!--<h4 class="categories-head">出版</h4>-->
      <!--<ul>-->
        <!--<li v-for="(item,index) in press" :key="index" class="categories-list" @click="goCategories">-->
          <!--<span class="name">{{item.name}}</span>-->
          <!--<span class="count">{{item.bookCount}}</span>-->
        <!--</li>-->
      <!--</ul>-->
    <!--</div>-->
  </div>
</template>
<script>
  import Header from '../header/Header'
  import {categories, subCategories} from '../../api/api'
  import {Indicator} from 'mint-ui'

  export default {
    name: 'Category',
    data() {
      return {
        female: [],
        male: [],
        manga: [],
        press: [],
        categoryType: {
          male: {
            name: 'male'
          },
          female: {
            name: 'female'
          }
        }
      }
    },
    created() {
      this.getCategories()
      subCategories().then(res => {
        console.log(res)
      })
    },
    components: {
      Header
    },
    methods: {
      getCategories() {
        Indicator.open('加载中...')
        categories().then(res => {
          console.log(res)
          if (res.status === 200) {
            let data = res.data
            this.female = data.female
            this.male = data.male
            this.manga = data.picture
            this.press = data.press
          }
          Indicator.close()
        }, error => {
          Indicator.close()
          console.log(error)
          Indicator.open('加载失败,请检查网络')
          setTimeout(() => {
            Indicator.close()
          }, 1500)
        })
      },
      goCategories(gender, item) {
        this.$router.push({path: '/categories/category-detail', query: {gender: gender, major: item.name}})
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../public/scss/mixin";

  .categories {
    .categories-section {
      .categories-head {
        height: 8.99vh;
        padding: 0 4vw;
        line-height: 8.99vh;
        color: #999;
      }
      .categories-list {
        display: inline-block;
        box-sizing: border-box;
        width: 33.33%;
        height: 8.99vh;
        padding: 1.5vh 2.67vw;
        border-right: 1px solid #f8f8f8;
        border-top: 1px solid #f8f8f8;
        &:nth-child(3n) {
          border-right: 0;
        }
        &:nth-last-of-type(1),
        &:nth-last-of-type(2),
        &:nth-last-of-type(3) {
          border-bottom: 1px solid #f8f8f8;
        }
        .name {
          display: block;
          font-size: 15px;
          font-weight: 700;
          line-height: 3vh;
          text-align: center;
        }
        .count {
          display: block;
          line-height: 3vh;
          font-size: 12px;
          text-align: center;
          color: #ccc;
        }
      }

    }
  }
</style>
