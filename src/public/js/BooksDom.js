import Book from './books'
export default function initializeBooks(list) {
  let result = []
  let booksArr = list
  booksArr.forEach(item => {
    let book = new Book({
      id: item._id,
      title: item.title,
      cover: item.cover,
      minorCate: item.minorCate || '',
      majorCate: item.majorCate || '',
      author: item.author,
      shortIntro: item.shortIntro || '',
      retentionRatio: item.retentionRatio || '',
      latelyFollower: item.latelyFollower || ''
    })
    result.push(book)
  })
  return result
}
