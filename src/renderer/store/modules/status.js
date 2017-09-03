import * as types from '../mutation-types'

const state = {
  event: {},
  images: [],
  containers: []
}

/* eslint no-param-reassign: ["error", { "props": false }] */
const mutations = {
  [types.UPDATE_EVENT] (state, event) {
    state.event = event
  },
  [types.REMOVE_EVENT] (state) {
    state.event = {}
  }
}

export default {
  state,
  mutations
}
