import Vue from 'vue'
import Resource from 'vue-resource'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import iView from 'iview'
import 'iview/dist/styles/iview.css'
import locale from 'iview/src/locale/lang/en-US'

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  next()
})

router.afterEach((to, from, next) => {
  iView.LoadingBar.finish()
})

// (node) warning: possible EventEmitter memory leak detected. 11 error listeners added.
require('events').EventEmitter.defaultMaxListeners = Infinity

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(iView, { locale })
Vue.use(Resource)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
