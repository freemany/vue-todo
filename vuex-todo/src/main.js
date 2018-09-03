import Vue from 'vue'
import App from './App.vue'
import Foo from '@/Foo.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

import brouter from './brouter' 
import Bar from '@/Bar'

Vue.config.productionTip = false

import Router from 'vue-router'

// Vue.use(Router)   // very important !!!

if (null !== document.querySelector('#app')) {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
}

// if (null !== document.querySelector('#app1')) {
//   new Vue({
//     router,
//     store,
//     render: h => h(App)
//   }).$mount('#app1')
// }

// if (null !== document.querySelector('#foo')) {
//   new Vue({
//     router,
//     store,
//     render: h => h(Foo)
//   }).$mount('#foo')
// }

if (null !== document.querySelector('#bar')) {
  new Vue({
    router: brouter,
    store,
    render: h => h(Bar)
  }).$mount('#bar')
}
