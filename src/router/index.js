import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Editor',
    component: () => import('../views/editor')
  }, {
    path: '/testView',
    name: 'TestView',
    component: () => import('../views/testView')
  }
]

const router = new VueRouter({
  routes
})

export default router
