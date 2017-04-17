import Vue from 'vue'
import Electron from 'vue-electron'
import Resource from 'vue-resource'
import Router from 'vue-router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import locale from 'iview/src/locale/lang/en-US'

import App from './App'
import routes from './routes'

// (node) warning: possible EventEmitter memory leak detected. 11 error listeners added.
require('events').EventEmitter.defaultMaxListeners = Infinity

Vue.use(iView, { locale })
Vue.use(Electron)
Vue.use(Resource)
Vue.use(Router)

Vue.config.debug = true

const router = new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes
})

/* eslint-disable no-new */
new Vue({
  router,
  ...App
}).$mount('#app')
