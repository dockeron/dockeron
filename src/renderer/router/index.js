import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'

Vue.use(Router)

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes
})
