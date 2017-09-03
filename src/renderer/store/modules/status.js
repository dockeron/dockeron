import * as types from '../mutation-types'

const state = {
  events: [],
  images: [],
  containers: []
}

/* eslint no-param-reassign: ["error", { "props": false }] */
const mutations = {
  [types.UPDATE_EVENT] (state, event) {
    while (state.events.length > 30) {
      state.events.shift()
    }

    state.events.push(event)
  }
}

export default {
  state,
  mutations
}
