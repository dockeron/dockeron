import Docker from 'dockerode'
import notify from './notify'
import docker from './docker'
import notNull from './notNull'

function remoteDocker (body) {
  try {
    if (notNull(body)) {
      return new Docker(body)
    } else {
      notify('Host body is empty!')
      return docker
    }
  } catch (e) {
    notify(e)
    return docker
  }
}

export default remoteDocker
