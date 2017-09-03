import docker from './docker'
import notify from './notify'
import { VUEX_ACTION_UPDATE_VERSION } from './constants/VuexConstants'

function updateVersion (vue) {
  const updateVersionCB = version => {
    vue.$store.dispatch(VUEX_ACTION_UPDATE_VERSION, version)
  }

  docker.version()
    .then(updateVersionCB)
    .catch(notify)
}

export default updateVersion
