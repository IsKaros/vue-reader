import * as types from './mutation-types'

export default {
  // ES6 变量作为函数名
  [types.ADD_BOOKSHELF](state, book) {
    if (state.bookShelf.indexOf(book) !== -1) {
      return 0
    } else {
      state.bookShelf.push(book)
    }
  },
  [types.REMOVE_BOOKSHELF](state, book) {
    for (let i in state.bookShelf) {
      if(state.bookShelf[i].title === book.title) {
        state.bookShelf.splice(i, 1)
      }
    }
  },
  [types.GET_BOOKSHELF](state, shelf) {
    state.bookShelf = shelf
  }
}
