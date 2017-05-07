import dockerHubApi from '../../js/dockerHubApi'
import notify from '../../js/notify'

const state = {
  username: '',
  token: ''
}

const mutations = {
  updateToken: function (state, token) {
    state.token = token
  },
  removeToken: function (state) {
    state.token = ''
  },
  updateUsername: function (state, username) {
    state.username = username
  },
  removeUsername: function (state) {
    state.username = ''
  }
}

const actions = {
  login: function (context, credentials) {
    function loginSuccess (token) {
      context.commit('updateToken', token.identitytoken)
      context.commit('updateUsername', credentials.username)
      notify('Welcome, ' + credentials.username + ' !')
    }

    function loginFailed (err) {
      notify(err)
    }

    dockerHubApi.login(credentials.username, credentials.password)
      .then(loginSuccess)
      .catch(loginFailed)
  },
  logout: function (context) {
    context.commit('removeToken')
    context.commit('removeUsername')
    notify('Goodbye, ' + state.username + ' !')
  }
}

export default {
  state,
  mutations,
  actions
}
