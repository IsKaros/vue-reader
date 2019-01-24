<template>
  <mt-header :fixed="fixed" :title='title' class="header">
    <div class="back" slot="left">
      <mt-button icon="back" @click="$router.go(-1)">返回</mt-button>
    </div>
    <router-link to="/home" class="home-page" slot="right" @click="$router.go('/home')">
      <span class="icon icon-home"></span>
    </router-link>
  </mt-header>
</template>
<script>
  export default {
    name: 'Header',
    props: {
      title: {
        type: String,
        required: true
      },
      fixed: {
        type: Boolean,
        default: false
      }
    }
  }
</script>
<style lang="scss" scoped>
  .header {
    height: 6.6vh;
    .home-page {
      font-size: 16px;
      padding-right: 2vw;
    }
  }
</style>
