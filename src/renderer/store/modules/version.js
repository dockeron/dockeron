import * as types from '../mutation-types'

const state = {
  version: {}
}

/* eslint no-param-reassign: ["error", { "props": false }] */
const mutations = {
  [types.UPDATE_VERSION] (state, version) {
    state.version = version
  }
}

export default {
  state,
  mutations
}
