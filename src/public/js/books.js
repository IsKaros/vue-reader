export default class Book {
  constructor({id, title, author, cover, desc, minorCate, majorCate, retentionRatio, shortIntro, latelyFollower}) {
    this.id = id
    this.title = title
    this.author = author
    this.cover = cover
    this.minorCate = minorCate
    this.majorCate = majorCate
    this.retentionRatio = retentionRatio
    this.shortIntro = shortIntro
    this.latelyFollower = latelyFollower
  }
}
