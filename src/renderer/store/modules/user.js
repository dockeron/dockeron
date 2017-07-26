import * as types from '../mutation-types'

const state = {
  username: ''
}

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
