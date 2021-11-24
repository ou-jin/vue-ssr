// router.js
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export function createRouter () {
  return new Router({
    mode: 'history',
    routes: [
        { path: '/',name:'home', component: () => import('../views/Home/index.vue') ,
          children:[
            { path: '/p1',name:'p1', component: () => import('../views/Page1/index.vue') },
            { path: '/p2',name:'p2', component: () => import('../views/Page2/index.vue') }
          ]
        }
        
    ]
  })
}