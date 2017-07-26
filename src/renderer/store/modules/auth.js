import types from '../mutation-types'

const state = {
  token: ''
}

/* eslint no-param-reassign: ["error", { "props": false }] */
const mutations = {
  [types.UPDATE_AUTH_TOKEN] (state, token) {
    state.token = token
  },
  [types.REMOVE_AUTH_TOKEN] (state) {
    state.token = ''
  }
}

export default {
  state,
  mutations
}
