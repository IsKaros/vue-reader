import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import * as getters from './getters'
// import * as actions from './actions'

Vue.use(Vuex)
const state = {
  bookShelf: []
}
export default new Vuex.Store({
  state,
  getters,
  mutations
  // actions
})
