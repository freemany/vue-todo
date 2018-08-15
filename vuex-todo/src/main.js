import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

Vue.config.productionTip = false

if (null !== document.querySelector('#app')) {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
}

if (null !== document.querySelector('#app1')) {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app1')
}
