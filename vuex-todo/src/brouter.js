import Vue from 'vue'
import Router from 'vue-router'

const TodoEditItem = () => import('@/components/TodoEditItem')
const BarEdit = () => import('@/components/BarEdit')

Vue.use(Router)   // very important !!!

const r = new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/bar-edit/:id', component: BarEdit }
  ]
});

export default r;