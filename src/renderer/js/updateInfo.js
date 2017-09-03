import docker from './docker'
import notify from './notify'
import { VUEX_ACTION_UPDATE_INFO } from './constants/VuexConstants'

function updateInfo (vue) {
  const updateInfoCB = info => {
    vue.$store.dispatch(VUEX_ACTION_UPDATE_INFO, info)
  }

  docker.info()
    .then(updateInfoCB)
    .catch(notify)
}

export default updateInfo
