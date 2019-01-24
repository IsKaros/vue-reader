<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import Header from './components/header/Header'
  export default {
  name: 'App',
  components: {
    Header
  }
}
</script>

<style>
  #app {}
</style>
