import Vue from 'vue'
import Router from 'vue-router'

const TodoEditItem = () => import('@/components/TodoEditItem')
const EmptyItem = () => import('@/components/EmptyItem')

Vue.use(Router)   // very important !!!

export default new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/edit/:id', component: TodoEditItem },
    { path: '*', component: EmptyItem}
  ]
});