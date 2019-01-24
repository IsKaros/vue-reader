<template>
  <div class="read" style="background-color: #eee6dd;" ref="read">
    <div class="read-content" @click="hide">
      <h1 class="title" ref="title" :style="{fontSize:titleFont+'px'}" style="color: #5c5d58;">
        {{bookContent.title}}</h1>
      <div class="book-content" v-html="formatBookContent" :style="{fontSize:txtFont+'px'}"
           style="text-indent: 2em;line-height: 1.5;color: #333" ref="content">
      </div>
    </div>
    <div class="read-set" v-show="showSetting">
      <div class="header-wrapper">
        <!--<transition-group class="up">-->
        <mt-header fixed :title="bookContent.title" class="header" :key="bookName">
          <div class="back" slot="left">
            <mt-button icon="back" @click="$router.go(-1)">返回</mt-button>
          </div>
        </mt-header>
        <div class="options" :key="txtFont">
          <router-link to="/home" class="option" tag="div" @click="$router.push('/home')">
            <span class="option-inner">
              <span class="icon icon-home"></span>
              <span class="text">主页</span></span>
          </router-link>
          <router-link to="/home" class="option" tag="div">
            <span class="option-inner">
              <span class="icon icon-book"></span>
              <span class="text">书架</span>
            </span>
          </router-link>
          <router-link to="/home" class="option" tag="div">
            <span class="option-inner">
              <span class="icon icon-file-text"></span>
              <span class="text">详情</span>
            </span>
          </router-link>
        </div>
        <!--</transition-group>-->
      </div>
      <div class="space" @click="hide"></div>
      <div class="setting">
        <div class="setting-item">
          <span class="font" @click="reduceSize" :class="{disabled:titleFont<=22}">Aa-</span>
          <span class="font" @click="increaseSize" :class="{disabled:titleFont>=28}">Aa+</span>
        </div>
        <div class="setting-item pattern" ref="patterns">
          <span v-for="(item, index) in patterns" :key="index" @click="changePattern" :class="{active:currentPattern.name==item.name}">{{item.name}}</span>
        </div>
        <div class="setting-item turn-pages">
          <span class="prev" @click="turnPrev" :class="{disabled:currentChapter<=0}">上一章</span>
          <span @click="clickCata">目录</span>
          <span class="next" @click="turnNext" :class="{disabled:currentChapter>=chapterList.length}">下一章</span>
        </div>
      </div>
    </div>
    <transition name="slide">
      <Catalog v-show="showCatalog" :chapters="chapterList" :bookName="bookName" :currentChapter="currentChapter"
               :showCatalog="showCatalog" @changeChapter="replaceChapter"></Catalog>
    </transition>
  </div>
</template>
<script>
  import {BookChapters, BookSources, ChapterContent} from '../../api/api'
  import BookContent from '../../public/js/bookSource'
  import {Indicator} from 'mint-ui'
  import Catalog from '../catalog/Catalog'

  export default {
    name: 'Read',
    data() {
      return {
        bookName: '',
        bookContent: {},
        sourceList: [],
        bookSourceLinks: [],
        chapterList: [],
        BookSourcesId: 0,
        patterns: [{
          name: '默认',
          background: '#eee6dd',
          title: '#333',
          content: '#5c5d58'
        }, {
          name: '夜间',
          background: '#0c0c0c',
          title: '#888',
          content: '#666'
        }, {
          name: '护眼',
          background: '#b8cd8d',
          title: '#0c2e10',
          content: 'rgba(12,46,16,.8)'
        }],
        currentPattern: {},
        showSetting: false,
        txtFont: 18,
        titleFont: 22,
        currentChapter: 0,
        showCatalog: false
      }
    },
    created() {
      this.getBookSources()
    },
    computed: {
      // 格式化文章的内容
      formatBookContent() {
        let c = /[\u4E00-\u9FA5\uF900-\uFA2D]/g
        let reg1 = /(\\n\\t)|(\\r\\n)|(\\n\\n\\t)|(\\n\\n)|(\\n)/g
        // let reg2 = /\\r\\n/g
        if (this.bookContent.content) {
          let result = JSON.stringify(this.bookContent.content).replace(/^"|"$/g, '')
          if (c.test(result)) {
            if (reg1.test(result)) {
              result = '<p>' + result.replace(/\s*/g, '').replace(reg1, '</p><p>') + '</p>'
            }
            return result
          } else {
            return '请购买VIP 继续阅读'
          }
        }
      }
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        vm.getUserLocalStorage()
        vm.getBookLocalStorage()
      })
    },
    beforeRouteLeave(to, from, next) {
      next((vm) => {
        vm.setUserLocalStorage()
        vm.setBookLocalStorage()
      })
    },
    methods: {
      // 通过id获取书源
      getBookSources() {
        BookSources(this.$route.params.id).then(res => {
          this.sourceList = res.data
          this.getBookChapter(this.sourceList[0]._id)
        })
      },
      // 通过对应的书源获取章节
      getBookChapter(id) {
        Indicator.open('加载中...')
        BookChapters(id).then(res => {
          console.log(res)
          if (res.status === 200) {
            let chapters = res.data.chapters
            this.bookName = res.data.bookName
            for (let i = 0; i < chapters.length; i++) {
              this.chapterList.push(chapters[i].title)
              this.bookSourceLinks.push(chapters[i].link)
            }
          }

          this.getChapterContent(this.bookSourceLinks[this.currentChapter])
        })
      },
      // 通过获取的章节数据中的链接获取对应章节的内容
      getChapterContent(link) {
        ChapterContent(link).then(res => {
          console.log(res)
          let chapter = res.data.chapter
          this.bookContent = this._instanteBook(chapter.title, chapter.cpContent)
          Indicator.close()
        }, error => {
          Indicator.close()
          console.log(error)
          Indicator.open('加载失败,请检查网络')
          setTimeout(() => {
            Indicator.close()
          }, 500)
        })
      },
      // 实例化一个书类
      _instanteBook(title, content) {
        let book = new BookContent(title, content)
        return book
      },
      // 缩小字体大小
      reduceSize() {
        console.log(this.$refs.title.style)
        // $refs只能获取行内样式
        if (this.titleFont <= 22) {
          return
        }
        this.txtFont -= 2
        this.titleFont -= 2
      },
      // 放大字体大小
      increaseSize() {
        if (this.titleFont >= 28) {
          return
        }
        this.txtFont += 2
        this.titleFont += 2
      },
      // 切换观看模式
      changePattern($event) {
        let targetTxt = $event.target.textContent
        this.setActive(targetTxt)
        for (let i in this.patterns) {
          let pattern = this.patterns[i]
          if (pattern.name === targetTxt) {
            console.log(this.$refs.patterns.children[i])
            this.currentPattern = pattern
            this.$refs.patterns.children[i].classList.add('active')
            this.$refs.read.style.backgroundColor = pattern.background
            this.$refs.title.style.color = pattern.title
            this.$refs.content.style.color = pattern.content
            return
          }
        }
      },
      // 选中模式高亮
      setActive(targetTxt) {
        for (let i in this.patterns) {
          let pattern = this.patterns[i]
          if (pattern.name !== targetTxt) {
            this.$refs.patterns.children[i].classList.remove('active')
          } else {
            this.$refs.patterns.children[i].classList.add('active')
          }
        }
      },
      // 切换章节-上一章
      turnPrev() {
        if (this.currentChapter <= 0) {
          return
        }
        this.currentChapter--
        this.showSetting = false
        this.getBookSources()
        window.screenTop = 0
      },
      // 切换章节-下一章
      turnNext() {
        if (this.currentChapter >= this.chapterList.length) {
          return
        }
        this.currentChapter++
        this.showSetting = false
        this.getBookSources()
        window.screenTop = 0
      },
      replaceChapter(chapter) {
        this.currentChapter = chapter
        this.getBookSources()
        this.showCatalog = false
      },
      // 点击目录
      clickCata() {
        this.showSetting = false
        this.showCatalog = true
      },
      // 设置和目录显示与隐藏
      hide() {
        if (this.showCatalog) {
          this.showSetting = false
          this.showCatalog = false
        } else {
          this.showSetting = !this.showSetting
        }
      },
      // 数据持久化之localStorage的设置
      setBookLocalStorage() {
        let localShelf = JSON.parse(window.localStorage.getItem('book')) ? JSON.parse(window.localStorage.getItem('book')) : {}
        localShelf[this.$route.params.id] = {}
        localShelf[this.$route.params.id].currentChapter = this.currentChapter
        localShelf[this.$route.params.id].bookSource = this.BookSourcesId
        console.log(localShelf)
        window.localStorage.setItem('book', JSON.stringify(localShelf))
      },
      // 获取localStorage
      getBookLocalStorage() {
        let localShelf = JSON.parse(window.localStorage.getItem('book')) ? JSON.parse(window.localStorage.getItem('book')) : {}
        if (localShelf[this.$route.params.id]) {
          this.currentChapter = localShelf[this.$route.params.id].currentChapter
        }
        return localShelf
      },
      // 将用户设置进行缓存
      setUserLocalStorage() {
        let localShelf = JSON.parse(window.localStorage.getItem('userSet')) ? JSON.parse(window.localStorage.getItem('userSet')) : {}
        localShelf = {
          txtFont: this.txtFont,
          titleFont: this.titleFont,
          currentPattern: this.currentPattern
        }
        window.localStorage.setItem('userSet', JSON.stringify(localShelf))
      },
      // 获取用户设置
      getUserLocalStorage() {
        let localShelf = JSON.parse(window.localStorage.getItem('userSet')) ? JSON.parse(window.localStorage.getItem('userSet')) : {}
        this.txtFont = localShelf.txtFont
        this.titleFont = localShelf.titleFont
        this.currentPattern = localShelf.currentPattern
        this.$refs.read.style.backgroundColor = this.currentPattern.background
        this.$refs.title.style.color = this.currentPattern.title
        this.$refs.content.style.color = this.currentPattern.content
      }
    },
    components: {
      Catalog
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../public/scss/variable";

  .read {
    position: relative;
    background-color: #eee6dd;
    z-index: 1;
    .read-content {
      padding-top: 3.75vh;
      .title {
        padding: 0 5.3vw;
        font-size: 22px;
        color: #333;
      }
      .book-content {
        padding: 1.5vh 5.3vw 0 5.3vw;
        color: #5c5d58;
        p {
          margin: 0.75vh auto;
          line-height: 1.5;
          font-size: 18px;
          text-indent: 2em;
        }
      }
    }
    .read-set {
      position: absolute;
      left: 0;
      top: 0;
      width: 100vw;
      height: 100vh;
      z-index: 3;
      .header-wrapper {
        position: relative;
        height: 6.6vh;
        .up-enter,
        .up-leave-to {
          transform: translateY(-100%);
          opacity: 0.3;
        }
        .up-enter-active,
        .up-leave-active {
          transition: all 0.5s linear;
        }
        .up-enter-to,
        .up-leave {
          transform: translateY(0);
          opacity: 1;
        }
        .header {
          height: 6.6vh;
          background-color: rgba(50, 51, 52, .9);
          h1 {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
        .options {
          position: absolute;
          z-index: 5;
          right: 4.0vw;
          top: 7.9vh;
          width: 23.8vw;
          height: 13.4vh;
          background-color: #323334;
          &:before {
            position: absolute;
            right: 3.17vw;
            transform: translateY(-100%);
            content: '';
            width: 0;
            height: 0;
            border: 9px solid #323334;
            border-color: transparent transparent #323334 transparent;
          }
          .option {
            .option-inner {
              display: block;
              width: 100%;
              height: 4.33vh;
              box-sizing: border-box;
              padding: 1.12vh 2.64vw;
              text-align: center;
              .icon {
                color: #ababab;
              }
              .text {
                margin-left: 2.64vw;
                font-size: 12px;
                color: #fff;
              }
            }
          }
        }
      }

      .space {
        position: absolute;
        left: 0;
        top: 6.6vh;
        width: 100%;
        height: 70.9vh;
        z-index: 2;
      }
      .setting {
        position: fixed;
        left: 0;
        bottom: 0;
        height: 19.5vh;
        width: 89.4vw;
        padding: 1.5vh 5.3vw;
        background-color: rgba(50, 51, 52, .9);

        .setting-item {
          width: 100%;
          height: 6vh;
          margin: 0 auto;
          text-align: center;
          .font {
            display: inline-block;
            width: 26.9vw;
            height: 4.63vh;
            line-height: 4.63vh;
            color: #fff;
            border: 1px solid #535353;
            border-radius: 0.5px;
            &.disabled {
              color: #888;
            }
          }
        }
        .pattern {
          margin: 1vh 0;
          span {
            display: inline-block;
            width: 26.9vw;
            height: 4.63vh;
            line-height: 4.63vh;
            color: #fff;
            border: 1px solid #535353;
            border-radius: 0.5px;
            &.active {
              border-color: $color-theme;
            }
          }
        }
        .turn-pages {
          display: flex;
          span {
            flex: 1;
            height: 4.63vh;
            line-height: 4.63vh;
            color: #fff;
            border: none;
            &.disabled {
              color: #888;
            }
          }
        }
      }
    }
    .slide-enter,
    .slide-leave-to {
      transform: translateX(-100%);
      opacity: 0.3;
    }
    .slide-enter-active,
    .slide-leave-active {
      transition: all .1s linear;
    }
    .slide-enter-to,
    .slide-leave {
      transform: translateX(0%);
      opacity: 1;
    }
  }
</style>
