import Router from 'vue-router'
import TodoEditItem from './../components/TodoEditItem'
// Views
// const Dashboard = () => import('@/views/Dashboard')

export default new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/edit/:id', component: TodoEditItem}
  ]
});