import * as types from '../mutation-types'

const state = {
  username: ''
}

/* eslint no-param-reassign: ["error", { "props": false }] */
const mutations = {
  [types.UPDATE_USERNAME] (state, username) {
    state.username = username
  },
  [types.REMOVE_USERNAME] (state) {
    state.username = ''
  }
}

export default {
  state,
  mutations
}
