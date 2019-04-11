import * as types from './mutation-types'

export default {
  // ES6 变量作为函数名
  [types.ADD_BOOKSHELF](state, book) {
    console.log(this)
    console.log(state.bookShelf)
    state.bookShelf.push(book)
  },
  [types.REMOVE_BOOKSHELF](state, book) {
    for (let i in state.bookShelf) {
      if (state.bookShelf[i].title === book.title) {
        state.bookShelf.splice(i, 1)
      }
    }
  },
  [types.SET_BOOKSHELF](state, shelf) {
    console.log(shelf)
    state.bookShelf = shelf
  }
}
