<template>
  <div class="header">
    <div class="head">
      <span class="header-txt">小说</span>
      <router-link to="/search" class="header-mine" tag="div">
        <i class="icon icon-search"></i>
      </router-link>
    </div>
    <div class="header-tab" ref="tab">
      <router-link class="tab-item" to="/home" @click="setActive">首页</router-link>
      <router-link class="tab-item" to="/categories" @click="setActive">分类</router-link>
      <router-link class="tab-item" to="/rank" @click="setActive">排名</router-link>
      <router-link class="tab-item" to="/books-List" @click="setActive">书单</router-link>
      <router-link class="tab-item" to="/mybooks" @click="setActive">书架</router-link>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'Header',
    methods: {
      setActive($event) {
        console.log($event)
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../public/scss/index";
  @import "../../public/scss/mixin";

  .header {
    width: 100%;
    position: relative;
    .head {
      width: 100%;
      height: 50px;
      .header-txt {
        float: left;
        color: $color-theme;
        font-size: 24px;
        padding: 20px;
      }
      .header-mine {
        display: inline-block;
        float: right;
        color: $color-theme;
        padding: 20px;
        font-size: 20px;
        icon {
          font-size: 20px;
        }
      }
    }
    .header-tab {
      display: flex;
      width: 100%;
      background-color: $color-theme;
      .tab-item {
        flex: 1;
        padding: 20px;
        color: #fff;
        text-align: center;
        font-size: 16px;
        @include border-r-1px(#fff)
      }
    }
  }
</style>
