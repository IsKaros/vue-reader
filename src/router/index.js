import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      component: resolve => require(['components/home/Home'], resolve),
      meta: {
        keepAlive: true
      }
    },
    {
      name: 'book_detail',
      path: '/book/:id',
      component: () => import('../common/BookDetail'),
      meta: {
        keepAlive: false // 不需要被缓存
      }
    },
    {
      name: 'read',
      path: '/read/:id',
      component: resolve => require(['components/read/Read'], resolve),
      meta: {
        keepAlive: false // 不需要被缓存
      }
    },
    {
      name: 'rank',
      path: '/rank',
      component: resolve => require(['components/rank/Rank'], resolve),
      meta: {
        keepAlive: false // 不需要被缓存
      }
    },
    {
      name: 'search',
      path: '/search',
      component: resolve => require(['components/search/Search'], resolve)
    },
    {
      name: 'search-result',
      path: '/search/search-result',
      component: () => import('../components/search/Search-Result')
    },
    {
      name: 'categories',
      path: '/categories',
      component: () => import('../components/categories/Categories')
    },
    {
      name: 'category-detail',
      path: '/categories/category-detail',
      component: () => import('../components/categories/CategoryDetail')
    },
    {
      name: 'books-list',
      path: '/books-list',
      component: () => import('../components/books-list/BooksList')
    },
    {
      name: 'list-detail',
      path: '/books-list/list-detail/:id',
      component: () => import('../components/books-list/ListDetail')
    },
    {
      name: 'rank-detail',
      path: '/rank/rank_detail/:id',
      component: () => import('../components/rank/RankingDetail'),
      meta: {
        keepAlive: false
      }
    },
    {
      name: 'bookshelf',
      path: '/mybooks',
      component: () => import('../components/bookshelf/BookShelf')
    }
  ]
})
