import Vue from 'vue'
import Resource from 'vue-resource'
import Router from 'vue-router'
import axios from 'axios'

import App from './App'
import routes from './router'
import store from './store'

import iView from 'iview'
import 'iview/dist/styles/iview.css'
import locale from 'iview/src/locale/lang/en-US'

// (node) warning: possible EventEmitter memory leak detected. 11 error listeners added.
require('events').EventEmitter.defaultMaxListeners = Infinity

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(iView, { locale })
Vue.use(Resource)
Vue.use(Router)

const router = new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes
})

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
