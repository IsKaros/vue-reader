// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
import axios from 'axios'
import './public/scss/_index.scss'
import './public/scss/_icon.scss'
import initializeBooks from './public/js/BooksDom'

Vue.config.productionTip = false
Vue.prototype.initializeBooks = initializeBooks
Vue.prototype.$axios = axios
Vue.use(Mint)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
