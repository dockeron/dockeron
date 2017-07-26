import * as types from '../mutation-types'

const state = {
  token: ''
}

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
